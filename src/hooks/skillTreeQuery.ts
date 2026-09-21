import { useMutation, useMutationState, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { toast } from 'sonner'
import { skillTreeRepo } from '../repository/skillTree.repo'
import type { SkillTreeResponse } from '../types/api/skillTree.types'
import { getAccessTokenFromLS } from '../utils/auth'
import { flattenNodes, toggleNodeInTree } from '../utils/skillTree'

const SKILL_TREE_KEY = ['Skill-tree']

type SkillTreeCache = AxiosResponse<SkillTreeResponse>

// Lật trạng thái 1 node trong cache (dùng cho cả optimistic update lẫn rollback)
const flipNode = (old: SkillTreeCache | undefined, nodeId: string) =>
  old && { ...old, data: { ...old.data, data: toggleNodeInTree(old.data.data, nodeId) } }

export const useMySkillTreeQuery = () => {
  return useQuery({
    queryKey: SKILL_TREE_KEY,
    queryFn: () => skillTreeRepo.getSkillTree(),
    enabled: !!getAccessTokenFromLS(), // chỉ gọi khi có token trong LS
    retry: false, // chưa có cây (404) hoặc token sai thì không cần retry
    refetchOnWindowFocus: false,
  })
}

export const useToggleSkillNodeMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: SKILL_TREE_KEY,
    mutationFn: ({ treeId, nodeId }: { treeId: string; nodeId: string }) => skillTreeRepo.toggleNode(treeId, nodeId),

    // Cập nhật cache ngay trước khi server trả lời
    onMutate: async ({ nodeId }) => {
      await queryClient.cancelQueries({ queryKey: SKILL_TREE_KEY })
      queryClient.setQueryData<SkillTreeCache>(SKILL_TREE_KEY, (old) => flipNode(old, nodeId))
    },

    // Thành công -> báo theo trạng thái hiện tại của node (cache đã được lật từ onMutate)
    onSuccess: (_data, { nodeId }) => {
      const cache = queryClient.getQueryData<SkillTreeCache>(SKILL_TREE_KEY)
      const node = cache ? flattenNodes(cache.data.data.nodes).find((n) => n.id === nodeId) : undefined

      toast.success(node?.isCompleted ? 'Đã đánh dấu hoàn thành!' : 'Đã bỏ đánh dấu hoàn thành!')
    },

    // Lỗi -> chỉ lật ngược đúng node đó, không đụng các node khác đang chờ
    // (toast lỗi đã do http.ts interceptor lo)
    onError: (_error, { nodeId }) => {
      queryClient.setQueryData<SkillTreeCache>(SKILL_TREE_KEY, (old) => flipNode(old, nodeId))
    },

    // Chỉ đồng bộ lại với server khi đây là request cuối cùng còn đang chạy
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: SKILL_TREE_KEY }) === 1) {
        queryClient.invalidateQueries({ queryKey: SKILL_TREE_KEY })
        queryClient.invalidateQueries({ queryKey: ['skills', 'my-skills-summary'] }) // Dashboard
      }
    },
  })
}

// Danh sách id các node đang chờ server (thay cho togglingId đơn lẻ)
export const useTogglingNodeIds = () =>
  useMutationState({
    filters: { mutationKey: SKILL_TREE_KEY, status: 'pending' },
    select: (mutation) => (mutation.state.variables as { nodeId: string }).nodeId,
  })

import { ALL_CATEGORIES, flattenNodes, filterTreeByCategory, toggleNodeInTree } from './skillTree'
import type { SkillNode, SkillTree } from '../types/api/skillTree.types'

// Cố định thời gian hệ thống để test trường 'completedAt' chính xác
const MOCK_DATE = '2026-09-24T12:00:00.000Z'

beforeAll(() => {
  jest.useFakeTimers()
  jest.setSystemTime(new Date(MOCK_DATE))
})

afterAll(() => {
  jest.useRealTimers()
})

// --- MOCK DATA ---
const mockNodes = [
  {
    id: '1',
    isCompleted: false,
    completedAt: null,
    skill: { id: 's1', name: 'React', category: 'Frontend' },
    children: [
      {
        id: '2',
        isCompleted: true,
        completedAt: '2026-09-20T00:00:00.000Z',
        skill: { id: 's2', name: 'State', category: 'Frontend' },
        children: [],
      },
      {
        id: '3',
        isCompleted: false,
        completedAt: null,
        skill: { id: 's3', name: 'NodeJS', category: 'Backend' },
        children: [
          {
            id: '4',
            isCompleted: false,
            completedAt: null,
            skill: { id: 's4', name: 'Express', category: 'Backend' },
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: '5',
    isCompleted: false,
    completedAt: null,
    skill: { id: 's5', name: 'Docker', category: 'DevOps' },
    children: [],
  },
] as unknown as SkillNode[]

const mockTree = {
  id: 'tree1',
  name: 'Fullstack Path',
  totalNodes: 5,
  completedCount: 1,
  completionPercentage: 20,
  nodes: mockNodes,
} as unknown as SkillTree

describe('Skill Tree Utils', () => {
  describe('flattenNodes', () => {
    it('Làm phẳng cây lồng nhau thành mảng 1 chiều theo đúng thứ tự DFS', () => {
      const flat = flattenNodes(mockNodes)

      expect(flat.length).toBe(5)
      // Thứ tự mong đợi: 1 -> 2 -> 3 -> 4 -> 5
      expect(flat.map((n) => n.id)).toEqual(['1', '2', '3', '4', '5'])
    })

    it('Trả về mảng rỗng nếu đầu vào rỗng', () => {
      expect(flattenNodes([])).toEqual([])
    })
  })

  describe('filterTreeByCategory', () => {
    it('Trả về nguyên bản nếu category là ALL_CATEGORIES', () => {
      const result = filterTreeByCategory(mockNodes, ALL_CATEGORIES)
      expect(result).toEqual(mockNodes)
    })

    it('Giữ lại node cha nếu node con khớp category (Dù cha không khớp)', () => {
      // Tìm category 'Backend' -> Phải giữ lại node 3, node 4 và node 1 (vì 1 chứa 3)
      const result = filterTreeByCategory(mockNodes, 'Backend')

      expect(result.length).toBe(1) // Node 1
      expect(result[0].id).toBe('1')
      expect(result[0].children.length).toBe(1) // Node 3
      expect(result[0].children[0].id).toBe('3')
      expect(result[0].children[0].children[0].id).toBe('4') // Node 4
    })

    it('Loại bỏ hoàn toàn các nhánh không chứa category tương ứng', () => {
      const result = filterTreeByCategory(mockNodes, 'DevOps')

      expect(result.length).toBe(1)
      expect(result[0].id).toBe('5') // Chỉ còn nhánh Docker, nhánh React bốc hơi
    })

    it('Trả về mảng rỗng nếu không có node nào khớp', () => {
      const result = filterTreeByCategory(mockNodes, 'AI_Engineer')
      expect(result).toEqual([])
    })
  })

  describe('toggleNodeInTree', () => {
    it('Chuyển node từ chưa hoàn thành (false) sang hoàn thành (true)', () => {
      // Node 5 ban đầu isCompleted: false
      const result = toggleNodeInTree(mockTree, '5')

      const flatResult = flattenNodes(result.nodes)
      const toggledNode = flatResult.find((n) => n.id === '5')

      expect(toggledNode?.isCompleted).toBe(true)
      expect(toggledNode?.completedAt).toBe(MOCK_DATE) // Sinh ngày mới

      // Cập nhật thống kê cây (Ban đầu 1, giờ thêm node 5 là 2)
      expect(result.completedCount).toBe(2)
      expect(result.completionPercentage).toBe(40) // 2/5 * 100
    })

    it('Chuyển node từ đã hoàn thành (true) về chưa hoàn thành (false)', () => {
      // Node 2 ban đầu isCompleted: true
      const result = toggleNodeInTree(mockTree, '2')

      const flatResult = flattenNodes(result.nodes)
      const toggledNode = flatResult.find((n) => n.id === '2')

      expect(toggledNode?.isCompleted).toBe(false)
      expect(toggledNode?.completedAt).toBeNull() // Xóa ngày hoàn thành

      // Cập nhật thống kê cây (Từ 1 tụt xuống 0)
      expect(result.completedCount).toBe(0)
      expect(result.completionPercentage).toBe(0)
    })

    it('Không làm thay đổi tree nếu nodeId truyền vào không tồn tại', () => {
      const result = toggleNodeInTree(mockTree, '999')

      expect(result.nodes).toEqual(mockTree.nodes)
      expect(result.completedCount).toBe(1)
      expect(result.completionPercentage).toBe(20)
    })

    it('Xử lý an toàn khi tree rỗng (totalNodes = 0) để không bị lỗi chia cho 0 (NaN)', () => {
      const emptyTree: SkillTree = { ...mockTree, totalNodes: 0, nodes: [] }
      const result = toggleNodeInTree(emptyTree, '1')

      expect(result.completionPercentage).toBe(0)
    })
  })
})

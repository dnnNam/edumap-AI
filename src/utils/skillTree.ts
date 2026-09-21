import type { SkillNode } from '../types/api/skillTree.types'

// Giá trị đặc biệt cho chip "All" (không trùng với tên category thật)
export const ALL_CATEGORIES = '__ALL__'

// Cây lồng nhau -> mảng phẳng (duyệt theo DFS, giữ đúng thứ tự hiển thị)
export function flattenNodes(nodes: SkillNode[]): SkillNode[] {
  return nodes.flatMap((node) => [node, ...flattenNodes(node.children)])
}

// Lọc theo category nhưng GIỮ node cha của node khớp để cây không bị đứt.
// Node cha không khớp vẫn có mặt (UI sẽ làm mờ nó).
export function filterTreeByCategory(nodes: SkillNode[], category: string): SkillNode[] {
  if (category === ALL_CATEGORIES) return nodes

  return nodes.flatMap((node) => {
    const children = filterTreeByCategory(node.children, category)
    const isMatch = node.skill.category === category
    return isMatch || children.length > 0 ? [{ ...node, children }] : []
  })
}

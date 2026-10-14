export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // Tính năng mới
        'fix', // Sửa lỗi
        'docs', // Tài liệu
        'style', // Format code, thiếu dấu chấm phẩy...
        'refactor', // Tái cấu trúc logic
        'perf', // Cải thiện hiệu năng
        'test', // Thêm hoặc sửa test
        'chore', // Việc phụ trợ (build tool, deps)
        'revert', // Hoàn tác commit trước
      ],
    ],
    'subject-case': [0], // Cho phép viết hoa/thường linh hoạt trong subject
  },
}

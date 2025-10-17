# Migrations

Thư mục này chứa các migration scripts để cập nhật cấu trúc database.

## Cấu trúc Migration File

Mỗi migration file phải export 2 functions:

```javascript
/**
 * Migration: Short description
 * Date: YYYY-MM-DD
 * Description: Detailed explanation
 */
const up = async () => {
  // Logic để apply migration
};

const down = async () => {
  // Logic để rollback migration (optional)
};

module.exports = { up, down };
```

## Cách sử dụng

### 1. Chạy tất cả migrations:
```bash
npm run migrate
```

### 2. Chạy một migration cụ thể:
```bash
node migrations/20251017_add_icon_to_techtype.js
```

Hoặc dùng npm script:
```bash
npm run migrate:icon
```

## Tạo Migration Mới

### Naming Convention:
```
YYYYMMDD_description.js
```

Ví dụ:
- `20251017_add_icon_to_techtype.js`
- `20251018_add_slug_to_project.js`
- `20251019_migrate_old_user_format.js`

### Template:
```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const YourModel = require('../models/YourModel');

/**
 * Migration: Short description
 * Date: YYYY-MM-DD
 * Description: Detailed explanation of what this migration does
 */
const up = async () => {
  // Your migration logic here
  console.log('  ✅ Migration completed');
};

/**
 * Rollback function (optional)
 */
const down = async () => {
  // Your rollback logic here
  console.log('  ✅ Rollback completed');
};

// Export for migration runner
module.exports = { up, down };

// Allow running directly
if (require.main === module) {
  (async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ MongoDB connected\n');
      await up();
      console.log('\n🎉 Migration completed!');
      await mongoose.connection.close();
      process.exit(0);
    } catch (error) {
      console.error('❌ Migration failed:', error);
      await mongoose.connection.close();
      process.exit(1);
    }
  })();
}
```

## So sánh với .NET Entity Framework

| .NET EF | Node.js + MongoDB |
|---------|-------------------|
| `Add-Migration AddIconToTechType` | Tạo file `YYYYMMDD_add_icon_to_techtype.js` |
| `Update-Database` | `npm run migrate` |
| `Update-Database -TargetMigration:Name` | `node migrations/xxx.js` |
| Auto-generated code | Viết logic migration thủ công |
| Built-in rollback | Tự implement `down()` function |
| Tracked in `__EFMigrationsHistory` | ⚠️ Không có tracking (cần tự implement) |

## Khi nào cần Migration?

### ✅ CẦN migration khi:
- Thêm field bắt buộc (`required: true`) vào documents cũ
- Transform/calculate data từ fields khác
- Thay đổi cấu trúc data (rename, split, merge fields)
- Set giá trị mặc định phức tạp cho data cũ

### ❌ KHÔNG CẦN migration khi:
- Thêm field optional (không có `required: true`)
- Field có `default` value đơn giản
- Chỉ có dev/test environment (chưa có production data)
- Data cũ ít, có thể update manual

## Migrations hiện có:

### 20251017_add_icon_to_techtype.js
- **Mục đích**: Thêm icon mặc định cho TechType không có icon
- **Tác động**: Update collection `techtypes`
- **Icon mặc định**: Book SVG icon (426 chars)

## Lưu ý

- MongoDB là schema-less nên migration không bắt buộc như SQL
- Luôn test migration trên dev environment trước
- Nên implement `down()` function để có thể rollback
- Luôn backup database trước khi chạy migration production
- Migration file có thể chạy trực tiếp hoặc qua `migrate.js` runner

const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

class UserController {
    // Hiển thị form chỉnh sửa thông tin user
    async edit(req, res) {
        try {
            console.log('UserEdit - req.user.avatar:', req.user.avatar);
            console.log('UserEdit - req.user.name:', req.user.name);
            
            // Lấy dữ liệu mới nhất từ database
            const profile = await User.findById(req.user._id).lean();
            console.log('UserEdit - profile.avatar:', profile.avatar);
            console.log('UserEdit - profile.name:', profile.name);
            
            if (!profile) {
                return res.status(404).send('Không tìm thấy người dùng.');
            }
            res.render('admin/User/edit', {
                layout: 'admin',
                title: 'Cập nhật Thông tin',
                // Không pass user, để dùng res.locals.user từ middleware
                profile: profile,
                success: req.query.success === 'true',
            });
        } catch (error) {
            console.error('Error fetching user for edit:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    // Cập nhật thông tin user
    async update(req, res) {
        try {
            const { name, email, position, description, currentPassword, newPassword } = req.body;
            
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).send('Không tìm thấy người dùng.');
            }

            // Validate required fields
            if (!name || !email) {
                const profile = await User.findById(req.user._id).lean();
                // Merge dữ liệu từ form vào profile để giữ lại những gì user đã nhập
                profile.name = name || profile.name;
                profile.email = email || profile.email;
                profile.position = position || profile.position;
                profile.description = description || profile.description;
                
                return res.status(400).render('admin/User/edit', {
                    layout: 'admin',
                    title: 'Cập nhật Thông tin',
                    // Không pass user, để dùng res.locals.user
                    profile,
                    error: 'Tên và email không được để trống.',
                });
            }

            // Check if email is already taken by another user
            const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
            if (existingUser) {
                const profile = await User.findById(req.user._id).lean();
                // Merge dữ liệu từ form vào profile
                profile.name = name;
                profile.email = email;
                profile.position = position;
                profile.description = description;
                
                return res.status(400).render('admin/User/edit', {
                    layout: 'admin',
                    title: 'Cập nhật Thông tin',
                    // Không pass user, để dùng res.locals.user
                    profile,
                    error: 'Email này đã được sử dụng bởi người dùng khác.',
                });
            }

            // Update basic info
            user.name = name;
            user.email = email;
            user.position = position || '';
            user.description = description || '';

            // Handle avatar upload
            if (req.files && req.files.avatar && req.files.avatar.length > 0) {
                // Xóa ảnh cũ nếu có
                if (user.avatar) {
                    const oldAvatarPath = path.join(__dirname, '../../public', user.avatar);
                    if (fs.existsSync(oldAvatarPath)) {
                        fs.unlinkSync(oldAvatarPath);
                    }
                }
                user.avatar = '/uploads/avatars/' + req.files.avatar[0].filename;
            }

            // Handle resume upload
            if (req.files && req.files.resume && req.files.resume.length > 0) {
                // Xóa resume cũ nếu có
                if (user.resume) {
                    const oldResumePath = path.join(__dirname, '../../public', user.resume);
                    if (fs.existsSync(oldResumePath)) {
                        fs.unlinkSync(oldResumePath);
                    }
                }
                user.resume = '/uploads/resumes/' + req.files.resume[0].filename;
            }

            // Change password if provided
            if (newPassword) {
                // Verify current password
                if (!currentPassword) {
                    const profile = await User.findById(req.user._id).lean();
                    // Merge dữ liệu từ form
                    profile.name = name;
                    profile.email = email;
                    profile.position = position;
                    profile.description = description;
                    
                    return res.status(400).render('admin/User/edit', {
                        layout: 'admin',
                        title: 'Cập nhật Thông tin',
                        // Không pass user, để dùng res.locals.user
                        profile,
                        error: 'Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu mới.',
                    });
                }

                const isMatch = await user.isValidPassword(currentPassword);
                if (!isMatch) {
                    const profile = await User.findById(req.user._id).lean();
                    // Merge dữ liệu từ form
                    profile.name = name;
                    profile.email = email;
                    profile.position = position;
                    profile.description = description;
                    
                    return res.status(400).render('admin/User/edit', {
                        layout: 'admin',
                        title: 'Cập nhật Thông tin',
                        // Không pass user, để dùng res.locals.user
                        profile,
                        error: 'Mật khẩu hiện tại không đúng.',
                    });
                }

                // Hash and update new password
                user.password = await bcrypt.hash(newPassword, 10);
            }

            await user.save();
            
            // Passport deserialize sẽ tự động lấy dữ liệu mới từ database ở request tiếp theo
            res.redirect('/admin/user/edit?success=true');
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = new UserController();

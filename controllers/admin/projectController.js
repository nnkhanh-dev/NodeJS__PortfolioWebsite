const Project = require('../../models/Project');
const Technical = require('../../models/Technical');
const fs = require('fs');
const path = require('path');

class ProjectController {

    async index(req, res) {
        try {
            const projects = await Project.find()
                .populate('userId', 'username')
                .populate('technologies', 'name')
                .lean();
            res.render('admin/Project/index', {
                layout: 'admin',
                title: 'Dự Án',
                projects,
            });
        } catch (error) {
            console.error('Error fetching projects:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async create(req, res) {
        try {
            const technologies = await Technical.find()
                .populate('typeId', 'name')
                .lean();
            
            res.render('admin/Project/create', {
                layout: 'admin',
                title: 'Thêm Dự Án',
                technologies,
            });
        } catch (error) {
            console.error('Error loading create form:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async store(req, res) {
        try {
            const { name, description, url, technologies } = req.body;
            if (!name) {
                const allTechnologies = await Technical.find()
                    .populate('typeId', 'name')
                    .lean();
                    
                return res.status(400).render('admin/Project/create', {
                    layout: 'admin',
                    title: 'Thêm Dự Án',
                    technologies: allTechnologies,
                    error: 'Tên dự án không được để trống.',
                });
            }

            // Xử lý thumbnail upload
            let thumbnail = '';
            if (req.file) {
                thumbnail = '/uploads/projects/' + req.file.filename;
            }

            // Xử lý technologies (có thể là string hoặc array)
            let techArray = [];
            if (technologies) {
                techArray = Array.isArray(technologies) ? technologies : [technologies];
            }

            const newProject = new Project({
                name,
                description,
                thumbnail,
                url,
                technologies: techArray,
                userId: req.user._id,
            });
            await newProject.save();

            res.redirect('/admin/projects');
        } catch (error) {
            console.error('Error creating project:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;
            const project = await Project.findById(id)
                .populate('userId', 'name email')
                .lean();
            if (!project) {
                return res.status(404).send('Dự án không tồn tại.');
            }
            res.render('admin/Project/show', {
                layout: 'admin',
                title: 'Chi Tiết Dự Án',
                // user từ res.locals
                project,
            });
        } catch (error) {
            console.error('Error fetching project details:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async edit(req, res) {
        try {
            const { id } = req.params;
            const [project, technologies] = await Promise.all([
                Project.findById(id).lean(),
                Technical.find().populate('typeId', 'name').lean()
            ]);
            
            if (!project) {
                return res.status(404).send('Dự án không tồn tại.');
            }
            
            res.render('admin/Project/edit', {
                layout: 'admin',
                title: 'Chỉnh sửa Dự Án',
                project,
                technologies,
            });
        } catch (error) {
            console.error('Error fetching project for edit:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, description, url, technologies } = req.body;
            
            if (!name) {
                const [project, allTechnologies] = await Promise.all([
                    Project.findById(id).lean(),
                    Technical.find().populate('typeId', 'name').lean()
                ]);
                
                return res.status(400).render('admin/Project/edit', {
                    layout: 'admin',
                    title: 'Chỉnh sửa Dự Án',
                    project,
                    technologies: allTechnologies,
                    error: 'Tên dự án không được để trống.',
                });
            }

            const project = await Project.findById(id);
            
            // Xử lý thumbnail upload
            let thumbnail = project.thumbnail; // Giữ thumbnail cũ
            if (req.file) {
                // Xóa ảnh cũ nếu có
                if (project.thumbnail) {
                    const oldImagePath = path.join(__dirname, '../../public', project.thumbnail);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                thumbnail = '/uploads/projects/' + req.file.filename;
            }

            // Xử lý technologies (có thể là string hoặc array)
            let techArray = [];
            if (technologies) {
                techArray = Array.isArray(technologies) ? technologies : [technologies];
            }

            project.name = name;
            project.description = description;
            project.thumbnail = thumbnail;
            project.url = url;
            project.technologies = techArray;
            
            await project.save();
            
            res.redirect('/admin/projects');
        } catch (error) {
            console.error('Error updating project:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const project = await Project.findById(id);
            
            // Xóa ảnh thumbnail nếu có
            if (project && project.thumbnail) {
                const imagePath = path.join(__dirname, '../../public', project.thumbnail);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
            
            await Project.findByIdAndDelete(id);
            res.status(200).json({ success: true, message: 'Dự án đã được xóa thành công.' });
        } catch (error) {
            console.error('Error deleting project:', error);
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi xóa dự án.' });
        }
    }
}

module.exports = new ProjectController();

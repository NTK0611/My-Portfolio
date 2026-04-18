const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const Portfolio = require('../models/Portfolio');
const Project = require('../models/Project');
const Skill = require('../models/Skill');

// ── Seed defaults on first run ──
async function seedDefaults() {
  const count = await Portfolio.count();
  if (count === 0) {
    await Portfolio.create({
      heroName: 'Nguyễn Tuấn Kiệt',
      heroTagline: 'Nice to meet you! My name is Kiệt and I am passionate about backend systems and cloud infrastructure. I am currently a junior student at Ho Chi Minh City International University and actively seeking internship opportunities. I look forward to meeting you!',
      bioText: 'Junior student at Ho Chi Minh City International University with a passion for building reliable backend systems.',
      email: 'nguyentuankietiu@gmail.com',
      github: 'https://github.com/NTK0611',
    });
  }

  const projectCount = await Project.count();
  if (projectCount === 0) {
    await Project.bulkCreate([
      {
        title: 'MangaHub',
        description: 'A platform to browse and read manga online.',
        tags: 'HTML,CSS,JavaScript',
        liveUrl: '#',
        githubUrl: '#',
        imageUrl: 'assets/images/projects/mangahub.png',
        order: 1,
      },
      {
        title: 'Personal Portfolio',
        description: 'This portfolio website — designed and built from scratch to showcase my work and skills.',
        tags: 'HTML,CSS,JavaScript,Node.js,MySQL',
        liveUrl: '#',
        githubUrl: 'https://github.com/NTK0611/My-Portfolio',
        imageUrl: 'assets/images/projects/portfolio.png',
        order: 2,
      },
    ]);
  }

  const skillCount = await Skill.count();
  if (skillCount === 0) {
    await Skill.bulkCreate([
      { name: 'HTML/CSS', category: 'language', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', order: 1 },
      { name: 'JavaScript', category: 'language', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', order: 2 },
      { name: 'Java', category: 'language', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', order: 3 },
      { name: 'Go', category: 'language', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg', order: 4 },
      { name: 'C / C++', category: 'language', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', order: 5 },
      { name: 'Node.js', category: 'tool', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', order: 1 },
      { name: 'Linux', category: 'tool', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg', order: 2 },
      { name: 'Docker', category: 'tool', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', order: 3 },
      { name: 'Git', category: 'tool', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', order: 4 },
      { name: 'MySQL', category: 'tool', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', order: 5 },
      { name: 'SQLite', category: 'tool', iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg', order: 6 },
    ]);
  }
}

seedDefaults();

// ── PUBLIC ROUTES ──

// GET /api/portfolio — get all portfolio data
router.get('/', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne();
    const projects = await Project.findAll({ order: [['order', 'ASC']] });
    const skills = await Skill.findAll({ order: [['order', 'ASC']] });
    res.json({ portfolio, projects, skills });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch portfolio data' });
  }
});

// ── ADMIN ROUTES ──

// PUT /api/portfolio — update hero/bio/contact info
router.put('/', protect, isAdmin, async (req, res) => {
  try {
    const { heroName, heroTagline, bioText, email, github } = req.body;
    let portfolio = await Portfolio.findOne();
    if (!portfolio) portfolio = await Portfolio.create({});
    await portfolio.update({ heroName, heroTagline, bioText, email, github });
    res.json({ message: 'Portfolio updated', portfolio });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update portfolio' });
  }
});

// POST /api/portfolio/projects — add new project
router.post('/projects', protect, isAdmin, async (req, res) => {
  try {
    const { title, description, tags, liveUrl, githubUrl, imageUrl, order } = req.body;
    const project = await Project.create({ title, description, tags, liveUrl, githubUrl, imageUrl, order });
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create project' });
  }
});

// PUT /api/portfolio/projects/:id — update project
router.put('/projects/:id', protect, isAdmin, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const { title, description, tags, liveUrl, githubUrl, imageUrl, order } = req.body;
    await project.update({ title, description, tags, liveUrl, githubUrl, imageUrl, order });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update project' });
  }
});

// DELETE /api/portfolio/projects/:id — delete project
router.delete('/projects/:id', protect, isAdmin, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await project.destroy();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

// POST /api/portfolio/skills — add new skill
router.post('/skills', protect, isAdmin, async (req, res) => {
  try {
    const { name, category, iconUrl, order } = req.body;
    const skill = await Skill.create({ name, category, iconUrl, order });
    res.status(201).json(skill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create skill' });
  }
});

// PUT /api/portfolio/skills/:id — update skill
router.put('/skills/:id', protect, isAdmin, async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    const { name, category, iconUrl, order } = req.body;
    await skill.update({ name, category, iconUrl, order });
    res.json(skill);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update skill' });
  }
});

// DELETE /api/portfolio/skills/:id — delete skill
router.delete('/skills/:id', protect, isAdmin, async (req, res) => {
  try {
    const skill = await Skill.findByPk(req.params.id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    await skill.destroy();
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete skill' });
  }
});

module.exports = router;
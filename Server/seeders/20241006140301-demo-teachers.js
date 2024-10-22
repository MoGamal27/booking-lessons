'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('teachers', [
      {
        name: 'Teacher medo',
        email: 'TeacherMedo@gmail.com',
        password: '12345678',
        old: 23,
        bio: '',
        image: 'https://res.cloudinary.com/dx0n30auq/image/upload/v1727952670/videos/rbizhp4wwcfvnfj1wtw8.png',
        video: 'https://res.cloudinary.com/dx0n30auq/video/upload/v1728215661/videos/spd3uorbubq7xdmeneg6.mp4',
        fees: 90,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Teacher Ahmed',
        old: 23,
        bio: '',
        image: ' https://res.cloudinary.com/dx0n30auq/image/upload/v1728213524/videos/ri4gyvunhprmnyy2ynu2.png',
        video: ' https://res.cloudinary.com/dx0n30auq/video/upload/v1728214219/videos/nj9knfu4za77m3b5f6fy.mp4',
        fees: 90,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Teacher nance',
        old: 23,
        bio: '',
        image: 'https://res.cloudinary.com/dx0n30auq/image/upload/v1728213553/videos/lan8cgvxnhyui7hnvo6m.png',
        video: 'https://res.cloudinary.com/dx0n30auq/video/upload/v1728214992/videos/lfe0y9ltzu8lglmkesvj.mp4',
        fees: 90,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Teacher Heba',
        old: 24,
        bio: '',
        image: 'https://res.cloudinary.com/dx0n30auq/image/upload/v1728210876/videos/ycnvdu5ss1dk4mlunw9e.png',
        video: 'https://res.cloudinary.com/dx0n30auq/video/upload/v1728222636/videos/nbpt4gwtok6enoubgpgh.mp4',
        fees: 90,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Teacher manar',
        old: 24,
        bio: '',
        image: 'https://res.cloudinary.com/dx0n30auq/image/upload/v1728413818/videos/mvxs2teiztjr6ozeq8kb.png',
        video: 'https://res.cloudinary.com/dx0n30auq/video/upload/v1728413788/videos/tpe4himylvj6f66e6li3.mp4',
        fees: 90,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('teachers', null, {});
  }
};


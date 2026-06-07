import bcrypt from "bcrypt";
import prisma from "./configs/db.js";

const DEMO_USER = {
  email: "user@demo.com",
  password: "Demo@123456",
  name: "Demo User",
};

const DEMO_ADMIN = {
  email: "admin@demo.com",
  password: "Demo@123456",
  name: "Demo Admin",
};

const DEFAULT_THEMES = [
  {
    themeName: "Midnight",
    backgroundColor: "#0c0a0e",
    cardColor: "#17131a",
    primaryText: "#f5f3f7",
    secondaryText: "#9a94a3",
    borderColor: "#2a2530",
  },
  {
    themeName: "Deep Purple",
    backgroundColor: "#0f0a14",
    cardColor: "#1a1225",
    primaryText: "#f3eefc",
    secondaryText: "#a895c4",
    borderColor: "#2d1f3d",
  },
  {
    themeName: "Slate Dark",
    backgroundColor: "#0b0d10",
    cardColor: "#14171c",
    primaryText: "#f1f3f5",
    secondaryText: "#8b929a",
    borderColor: "#262a30",
  },
];

async function seed() {
  console.log("Seeding database...");

  const existingThemes = await prisma.theme.count();
  if (existingThemes === 0) {
    await prisma.theme.createMany({ data: DEFAULT_THEMES });
    console.log(`Created ${DEFAULT_THEMES.length} default themes`);
  }

  const themes = await prisma.theme.findMany();
  const defaultThemeId = themes[0].id;

  const saltRounds = 10;

  const existingUser = await prisma.users.findUnique({
    where: { email: DEMO_USER.email },
  });

  let userId;
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(DEMO_USER.password, saltRounds);

    const user = await prisma.users.create({
      data: {
        name: DEMO_USER.name,
        email: DEMO_USER.email,
        password: hashedPassword,
        role: "USER",
        activeTheme: defaultThemeId,
        picture: "https://placehold.co/150x150.png",
      },
    });
    userId = user.id;

    await prisma.bio.create({
      data: {
        bioName: DEMO_USER.name,
        jobTitle: "Full Stack Developer",
        bio: "Passionate full stack developer with 5+ years of experience building web applications. Love turning complex problems into simple, beautiful, and intuitive solutions.",
        heroImage: "https://placehold.co/800x400.png",
        usersId: userId,
      },
    });

    await prisma.contacts.create({
      data: {
        github: "https://github.com/demo-user",
        linkedin: "https://linkedin.com/in/demo-user",
        twitter: "https://twitter.com/demo-user",
        usersId: userId,
      },
    });

    await prisma.layouts.create({
      data: {
        heroLayout: "1",
        expLayout: "1",
        skillsLayout: "1",
        projectsLayout: "1",
        usersId: userId,
      },
    });

    await prisma.experiences.create({
      data: {
        cName: "Tech Corp",
        position: "Senior Full Stack Developer",
        duration: "Jan 2022 - Present",
        role: "<ul><li>Led development of microservices architecture serving 1M+ users</li><li>Mentored junior developers and conducted code reviews</li><li>Improved application performance by 40% through optimization</li></ul>",
        location: "San Francisco, CA",
        cLogo: "https://placehold.co/50x50.png",
        usersId: userId,
      },
    });

    await prisma.experiences.create({
      data: {
        cName: "StartupX",
        position: "Frontend Developer",
        duration: "Mar 2020 - Dec 2021",
        role: "<ul><li>Built responsive React applications with TypeScript</li><li>Implemented state management and routing solutions</li><li>Collaborated with design team on UI/UX improvements</li></ul>",
        location: "Remote",
        cLogo: "https://placehold.co/50x50.png",
        usersId: userId,
      },
    });

    await prisma.skills.createMany({
      data: [
        { skillName: "React", skillLogo: "https://placehold.co/50x50.png", usersId: userId },
        { skillName: "TypeScript", skillLogo: "https://placehold.co/50x50.png", usersId: userId },
        { skillName: "Node.js", skillLogo: "https://placehold.co/50x50.png", usersId: userId },
        { skillName: "PostgreSQL", skillLogo: "https://placehold.co/50x50.png", usersId: userId },
        { skillName: "Docker", skillLogo: "https://placehold.co/50x50.png", usersId: userId },
      ],
    });

    console.log(`Created demo USER: ${DEMO_USER.email} / ${DEMO_USER.password}`);
  } else {
    userId = existingUser.id;
    console.log(`Demo USER already exists: ${DEMO_USER.email}`);
  }

  const existingAdmin = await prisma.users.findUnique({
    where: { email: DEMO_ADMIN.email },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(DEMO_ADMIN.password, saltRounds);

    const admin = await prisma.users.create({
      data: {
        name: DEMO_ADMIN.name,
        email: DEMO_ADMIN.email,
        password: hashedPassword,
        role: "ADMIN",
        activeTheme: defaultThemeId,
        picture: "https://placehold.co/150x150.png",
      },
    });

    await prisma.bio.create({
      data: {
        bioName: DEMO_ADMIN.name,
        jobTitle: "Platform Administrator",
        bio: "Platform administrator managing users, themes, and overall system health.",
        heroImage: "https://placehold.co/800x400.png",
        usersId: admin.id,
      },
    });

    await prisma.contacts.create({
      data: {
        github: "https://github.com/demo-admin",
        linkedin: "https://linkedin.com/in/demo-admin",
        usersId: admin.id,
      },
    });

    await prisma.layouts.create({
      data: {
        heroLayout: "1",
        expLayout: "1",
        skillsLayout: "1",
        projectsLayout: "1",
        usersId: admin.id,
      },
    });

    console.log(`Created demo ADMIN: ${DEMO_ADMIN.email} / ${DEMO_ADMIN.password}`);
  } else {
    console.log(`Demo ADMIN already exists: ${DEMO_ADMIN.email}`);
  }

  console.log("Seeding complete!");
}

seed()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

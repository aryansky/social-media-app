import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const usernames = [
    "codeWizard42",
    "pixelPilot",
    "devDrifter",
    "asyncAryan",
    "logicLoop",
    "stackSurfer",
    "scriptSmith",
    "neoNode",
    "byteCrafter",
    "refactorRex",
    "uxNomad",
    "commitJunkie",
    "bugHunter007",
    "snackOverflow",
    "kernelKnight",
];

const displayNames = [
    "Aryan Y.",
    "Pixel Wanderer",
    "Code Whisperer",
    "Night Owl Dev",
    "The Debugger",
    "Echo Mirage",
    "Neon Falcon",
    "Silent Commit",
    "The Terminalist",
    "Byte Nomad",
    "Logic Weaver",
    "Async Dreamer",
    "Null Prophet",
    "Scripted Soul",
    "Binary Bard",
    "Stack Vagrant",
    "Shadow Coder",
    "Patch Seeker",
    "Refactor Monk",
    "Syntax Rogue",
    "Cloud Maven",
    "Ping Pirate",
    "Dev Phantom",
    "Logic Tide",
    "Quantum Ghost",
    "Retro Hacker",
    "Tab Master",
    "Cyber Verse",
    "TypeSafe",
    "Root Traveler",
    "FrontEnd Rebel",
    "BackEnd Beast",
    "Neural Poet",
    "Clean Commit",
    "Bit Slinger",
    "UI Nomad",
    "Dark Mode Monk",
    "Wireframe Sage",
    "Fullstack Striker",
    "Port 3000",
];

const postsData = [
    {
        title: "My First Line of Code",
        content:
            "Wrote my first `console.log('Hello, World!')` today. I feel powerful.",
    },
    {
        title: "Dark Mode Forever",
        content:
            "If your app doesn't support dark mode, do you even care about my eyes?",
    },
    {
        title: "Bug of the Day",
        content:
            "Spent 3 hours fixing a bug. Turned out it was a missing semicolon. Classic.",
    },
    {
        title: "Weekend Hackathon Vibes",
        content: "48 hours, 12 Red Bulls, 1 MVP. Not bad for a weekend.",
    },
    {
        title: "Tab vs Spaces",
        content: "The only war worth fighting. Spoiler: 2 spaces is king.",
    },
    {
        title: "Commit Messages Matter",
        content:
            "Don't be that person writing 'fix stuff' in every commit. Show some respect.",
    },
    {
        title: "New UI Push",
        content:
            "Just deployed a fresh UI redesign. Minimal, clean, and dark. Thoughts?",
    },
    {
        title: "Learning TypeScript",
        content: "Goodbye, `any`. Hello, peace of mind.",
    },
    {
        title: "What’s in Your .bashrc?",
        content:
            "Share your coolest terminal aliases. I'll start: `alias gs='git status'`",
    },
    {
        title: "Framework Fatigue",
        content:
            "React, Svelte, Vue, Solid... sometimes I just want to write HTML.",
    },
    {
        title: "Deploy Nightmares",
        content: "Deployment at 3AM is the new horror genre.",
    },
    {
        title: "VSCode Extensions I Love",
        content:
            "Prettier, GitLens, and TODO Highlight are my top 3. What about you?",
    },
    {
        title: "Daily Standup Thoughts",
        content:
            "Nothing makes you rethink your life like saying 'still working on it' 3 days in a row.",
    },
    {
        title: "API Rate Limits",
        content: "They're not real until they slap you mid-demo.",
    },
    {
        title: "CSS Is Hard",
        content: "Flexbox and Grid are amazing. Until they’re not.",
    },
    {
        title: "Productivity Hacks",
        content:
            "Pomodoro timer, noise-canceling headphones, and no meetings before lunch.",
    },
    {
        title: "JavaScript Magic",
        content: "`[] + [] = ''` blows my mind every time.",
    },
    {
        title: "Why I Switched to Linux",
        content: "No telemetry. Full control. Tiling windows. Chef’s kiss.",
    },
    { title: "React useEffect Woes", content: "Why does this run twice? WHY?" },
    {
        title: "Side Project Syndrome",
        content: "Starting is fun. Finishing? Not so much.",
    },
    {
        title: "Open Source Wins",
        content: "Just merged my first PR into an OSS repo. Feels amazing.",
    },
    {
        title: "Imposter Syndrome",
        content:
            "When everyone in the room seems smarter than you, just remember: you’re here too.",
    },
    {
        title: "The Power of Git",
        content: "Learn `rebase`. It will change your life — or destroy it.",
    },
    {
        title: "Monorepos Are Wild",
        content: "I came for the shared code. Stayed for the build errors.",
    },
    {
        title: "Favorite Tech Stack?",
        content: "Mine's TypeScript, Next.js, Tailwind, Prisma. Yours?",
    },
    { title: "Coffee vs Code", content: "One doesn’t run without the other." },
    {
        title: "The .env Incident",
        content: "Yes, I pushed my API key to GitHub. Yes, I rotated it.",
    },
    {
        title: "Minimalism in Code",
        content:
            "If you can't explain your code in one sentence, it's too complex.",
    },
    {
        title: "The Joy of Clean Commits",
        content: "`git log` should read like a story, not a diary.",
    },
    {
        title: "I Broke Production",
        content: "And all I changed was one line. 😅",
    },
    {
        title: "The Linter Caught Me",
        content: "I thought I was smart... until ESLint humbled me.",
    },
    {
        title: "Drowning in Logs",
        content: "Today's debugging tool: 37 console.logs.",
    },
    {
        title: "Finally Understood Closures",
        content: "It clicked! I finally get how closures work in JS.",
    },
    {
        title: "Refactoring Feels Good",
        content: "Nothing like deleting 100 lines and making it work better.",
    },
    {
        title: "Design to Code",
        content: "Tried Figma to React workflow. Surprisingly smooth.",
    },
    {
        title: "REST vs GraphQL",
        content:
            "GraphQL gives you power. REST gives you sanity. Choose wisely.",
    },
    {
        title: "Docker Success",
        content: "My app finally runs in a container. Time to cry happy tears.",
    },
    {
        title: "Don't Ignore Accessibility",
        content: "A11y isn’t a feature — it’s a responsibility.",
    },
    {
        title: "Silent Failures",
        content: "Nothing breaks trust like a feature that *seems* to work.",
    },
    {
        title: "That One Perfect Commit",
        content:
            "All tests passed. No warnings. Clean diff. A rare moment of bliss.",
    },
];

const comments = [
    "This is so relatable 😂",
    "I’ve been there. Stay strong!",
    "Clean code is a mindset.",
    "Tabs all the way, no debate.",
    "Thanks for sharing this!",
    "Can’t believe I didn’t know this before.",
    "Same bug got me last week!",
    "Dark mode supremacy 👑",
    "100% agree with this.",
    "Flexbox still confuses me sometimes.",
    "I actually laughed out loud at this.",
    "What extension do you use for that?",
    "Bookmarking this forever.",
    "You explained this better than my prof.",
    "Legendary commit message 🔥",
    "I thought I was the only one!",
    "The .env thing is too real 💀",
    "Big W for refactoring!",
    "This post deserves more attention.",
    "Every dev should read this.",
    "Respect for using semver properly 👏",
    "Loved the writing style here.",
    "Honestly, this motivated me.",
    "Your stack sounds solid!",
    "Nothing like a clean diff!",
    "Been debugging this for days, thank you!",
    "Can you drop your setup?",
    "I broke prod with one line too 😭",
    "Designers and devs must unite!",
    "Goodbye `console.log`, hello `debugger`!",
    "This just made my day.",
    "You earned a follow from me.",
    "This belongs on dev.to",
    "I’m implementing this tonight.",
    "Respect for the accessibility mention.",
    "Even ChatGPT couldn’t have said it better.",
    "You deserve a medal for this commit.",
    "Chef’s kiss 💻👌",
    "Can’t unsee this now, thanks lol",
    "Subscribed to this kind of content!",
];

const replies = [
    "Haha I thought the same thing!",
    "Exactly! Glad someone said it.",
    "Thanks for pointing that out!",
    "Same issue here, how did you fix it?",
    "LMAO right??",
    "This made me laugh harder than it should’ve.",
    "That’s actually a good perspective.",
    "You explained it better than the post lol.",
    "Wow, didn’t think of it that way.",
    "Preach 🙌",
    "That’s what I keep telling people!",
    "Legend behavior 😂",
    "Yep, been there too many times.",
    "Glad I’m not the only one!",
    "Real for no reason.",
    "Solid advice, thanks!",
    "Facts on facts.",
    "Bro said it better than the post.",
    "You win the internet today.",
    "I was thinking this exactly!",
    "Genuinely helpful reply.",
    "It’s the little things that get us.",
    "You should write a blog on this.",
    "You just saved me an hour!",
    "I needed to hear that, thanks.",
    "You get it 💯",
    "That one hurt, but it’s true.",
    "Took the words right out of my mouth.",
    "Confirmed: this is elite knowledge.",
    "This is the way.",
    "Your reply is better than the original post.",
    "Yo fr!!",
    "This was so helpful omg.",
    "Man, you nailed it.",
    "Just applied your suggestion, it worked!",
    "Now I don’t feel so dumb haha.",
    "I’m stealing this reply 😅",
    "This made it click for me!",
    "You just unlocked a memory.",
    "That last line was too real.",
];

const tagLabels = [
    "javascript",
    "typescript",
    "react",
    "nextjs",
    "backend",
    "frontend",
    "css",
    "nodejs",
    "prisma",
    "sql",
    "webdev",
    "api",
    "auth",
    "uiux",
    "docker",
    "testing",
    "graphql",
    "orm",
    "design",
    "git",
];

function getRandomVote() {
    const votes = [1, -1];
    return votes[Math.floor(Math.random() * votes.length)];
}
async function seedDatabase() {
    // Clean previous data (optional, be careful in prod)
    await prisma.postTag.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.commentVote.deleteMany();
    await prisma.postVote.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.post.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    // Create users one by one to retain control
    const createdUsers = [];
    const hashedPassword = await bcrypt.hash("qwe123", 12);
    for (let i = 0; i < usernames.length; i++) {
        const user = await prisma.user.create({
            data: {
                username: usernames[i],
                email: `${usernames[i]}@somemail.com`,
                displayName: displayNames[i % displayNames.length],
            },
        });
        const account = await prisma.account.create({
            data: {
                provider: "credentials",
                providerId: user.id,
                userId: user.id,
                password: hashedPassword,
            },
        });
        createdUsers.push(user);
    }
    console.log("Multiple users and accounts have been created");

    // Create posts
    for (let post of postsData) {
        const randomUser =
            createdUsers[Math.floor(Math.random() * createdUsers.length)];

        await prisma.post.create({
            data: {
                userId: randomUser.id,
                title: post.title,
                content: post.content,
            },
        });
    }
    console.log("Multiple posts have been created");

    const users = await prisma.user.findMany();
    const posts = await prisma.post.findMany();

    for (let comment of comments) {
        const randomUser =
            createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const randomPost = posts[Math.floor(Math.random() * posts.length)];

        await prisma.comment.create({
            data: {
                userId: randomUser.id,
                content: comment,
                postId: randomPost.id,
            },
        });
    }
    console.log("Multiple comments have been created");

    const allComments = await prisma.comment.findMany();

    for (let reply of replies) {
        const randomUser =
            createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const randomComment =
            allComments[Math.floor(Math.random() * allComments.length)];

        await prisma.comment.create({
            data: {
                userId: randomUser.id,
                content: reply,
                postId: randomComment.postId,
                parentCommentId: randomComment.id,
            },
        });
    }
    console.log("Multiple replies have been created");

    for (let post of posts) {
        const voters = createdUsers
            .filter((u) => u.id !== post.userId) // avoid self-vote
            .sort(() => 0.5 - Math.random())
            .slice(0, 5); // 5 random voters per post

        for (let voter of voters) {
            await prisma.postVote.upsert({
                where: {
                    userId_postId: {
                        userId: voter.id,
                        postId: post.id,
                    },
                },
                update: {
                    vote: getRandomVote(),
                },
                create: {
                    userId: voter.id,
                    postId: post.id,
                    vote: getRandomVote(),
                },
            });
        }
    }
    console.log("Multiple post Votes have been created");

    for (let comment of allComments) {
        const voters = createdUsers
            .filter((u) => u.id !== comment.userId)
            .sort(() => 0.5 - Math.random())
            .slice(0, 5); // 5 random voters per comment

        for (let voter of voters) {
            await prisma.commentVote.upsert({
                where: {
                    userId_commentId: {
                        userId: voter.id,
                        commentId: comment.id,
                    },
                },
                update: {
                    vote: getRandomVote(),
                },
                create: {
                    userId: voter.id,
                    commentId: comment.id,
                    vote: getRandomVote(),
                },
            });
        }
    }
    console.log("Multiple comment Votes have been created");

    for (let user of users) {
        await prisma.follow.createMany({
            data: users
                .filter((usr) => usr.id !== user.id)
                .map((usr) => {
                    return {
                        followerId: user.id,
                        followingId: usr.id,
                    };
                }),
        });
    }
    console.log("Multiple user followers have been created");

    const createdTags = await Promise.all(
        tagLabels.map((label) =>
            prisma.tag.upsert({
                where: { label },
                update: {},
                create: { label },
            })
        )
    );
    console.log("Multiple tags have been created");

    for (let post of posts) {
        const numberOfTags = Math.floor(Math.random() * 3) + 1; // 1–3 tags
        const shuffled = createdTags.sort(() => 0.5 - Math.random());
        const selectedTags = shuffled.slice(0, numberOfTags);

        for (let tag of selectedTags) {
            await prisma.postTag.upsert({
                where: {
                    postId_tagId: {
                        postId: post.id,
                        tagId: tag.id,
                    },
                },
                update: {},
                create: {
                    postId: post.id,
                    tagId: tag.id,
                },
            });
        }
    }

    console.log("✅ Database seeded successfully.");
}

seedDatabase();

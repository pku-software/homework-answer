import {
    defineUserConfig,
    defaultTheme,
    type SidebarConfigArray,
    type SidebarItem,
    type App,
    createPage,
    Page,
} from "vuepress";
import { contests, problems } from "./data.json";

function getSidebar(): SidebarConfigArray {
    const sidebar: SidebarConfigArray = [];
    for (const contest of contests) {
        const children: SidebarItem[] = [];
        for (const problem of contest.problems) {
            children.push({
                text: problem.title,
                link: `/t${problem.id}.html`,
            });
        }
        sidebar.push({
            text: contest.title,
            link: `/d${contest.id}.html`,
            children,
        });
    }
    return sidebar;
}

async function onInitialized(app: App) {
    const pages: Promise<Page>[] = [];
    for (const contest of contests) {
        pages.push(
            createPage(app, {
                path: `/d${contest.id}.html`,
                content: `# ${contest.title}

${contest.description}

## 题目列表

${contest.problems.map((p) => `- [${p.title}](./t${p.id}.html)`).join("\n")}`,
            })
        );
    }
    for (const [id, problem] of Object.entries(problems)) {
        pages.push(
            createPage(app, {
                path: `/t${id}.html`,
                content: `# ${problem.title}

::: details

### 题目描述

${problem.description}

### 关于输入

${problem.input}

### 关于输出

${problem.output}

:::

${problem.explanation}

## 参考答案

${
    typeof problem.codes === "string"
        ? "```cpp\n" + problem.codes + "```"
        : "<CodeGroup>\n" +
          Object.entries(problem.codes).map(([title, code]) => {
              return `<CodeGroupItem title="${title}">\n\n\`\`\`cpp\n${code}\n\`\`\`\n\n</CodeGroupItem>`;
          }) +
          "\n</CodeGroup>"
}
                `,
            })
        );
    }

    app.pages.push(...(await Promise.all(pages)));
}

export default defineUserConfig({
    base: "/homework-answer/",
    title: "北大软设作业答案",
    public: "../../problems",
    onInitialized,
    theme: defaultTheme({
        sidebar: getSidebar(),
        sidebarDepth: 0
    }),
});

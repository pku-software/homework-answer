import { getContests, getProblemsOfContest, getProblemInfo, type ProblemInfo } from "@gytx/openjudge-api";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { writeFile } from "node:fs/promises";
import { Answer, getAnswer, getContestDetails } from "./fs.js";

dotenv.config();

// 每学期初修改
const CURRENT_SEMESTER = 2025;
// 开发用
const TODAY = process.env.TEST_DATE ? new Date(process.env.TEST_DATE) : new Date();

export type AnswerInfo = ProblemInfo & Answer;
export interface BriefProblemInfo {
    title: string,
    id: number
}
export interface ContestInfo {
    id: number,
    title: string,
    href: string,
    description: string,
    problems: BriefProblemInfo[]
}
export type ProblemsGroup = Record<number, AnswerInfo>;
export type ContestsGroup = ContestInfo[];

const allProblems: ProblemsGroup = {};
const allContests: ContestsGroup = [];

const contests = await getContests();
for (const c of contests) {
    // 练习
    if (c.beginDate === null || c.endDate === null) continue;
    // 尚未截止
    if (+c.endDate > +TODAY) continue;
    // 过期
    if (+c.beginDate < +new Date(CURRENT_SEMESTER, 0, 1)) continue;
    // 考试
    if (c.title.includes("期中考试")) continue;

    const problems = await getProblemsOfContest(c.id);
    const briefInfos: BriefProblemInfo[] = [];
    for (const p of problems) {
        if (!(p.id in allProblems)) {
            let info;
            if (p.id < 25957) {
                // Not defined by us
                info = await getProblemInfo(c.href, p.number);
            } else {
                info = await getProblemInfo(p.id);
            }
            const answer = await getAnswer(p.id);
            allProblems[p.id] = {
                ...info,
                ...answer
            }
        }
        briefInfos.push({
            id: p.id,
            title: `${p.number}. ${allProblems[p.id].title}`
        })
    }
    allContests.push({
        id: c.id,
        title: c.title,
        href: c.href,
        description: await getContestDetails(c.id),
        problems: briefInfos
    })
}

const DESTINATION = fileURLToPath(new URL("../docs/.vuepress/data.json", import.meta.url));

await writeFile(DESTINATION, JSON.stringify({
    contests: allContests,
    problems: allProblems
}/*, null, 2 */));

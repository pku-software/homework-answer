import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const PROBLEMS_FOLDER = fileURLToPath(new URL("../data/problems", import.meta.url));
const CONTESTS_FOLDER = fileURLToPath(new URL("../data/contests", import.meta.url));

async function getCpp(id: number, variant?: string) {
    const filepath = `${PROBLEMS_FOLDER}/${id}${
        typeof variant === "string" ? `-${variant}` : ""
    }.cpp`;
    return readFile(filepath, "utf-8");
}

export interface Answer {
    codes: string | Record<string, string>;
    explanation: string;
}

export async function getContestDetails(id: number): Promise<string> {
    const path = `${CONTESTS_FOLDER}/${id}.md`;
    if (existsSync(path)) {
        return readFile(path, "utf-8");
    } else {
        return "";
    }
}

export async function getAnswer(id: number): Promise<Answer> {
    const path = `${PROBLEMS_FOLDER}/${id}.md`;
    if (existsSync(path)) {
        const md = await readFile(path, "utf-8");
        const { data, content } = matter(md);
        if ("codes" in data) {
            const codes: Record<string, string> = {};
            for (const variant in data.codes) {
                const name = data.codes[variant];
                if (typeof name !== "string") {
                    throw new Error("NOT STRING");
                }
                codes[name] = await getCpp(id, variant);
            }
            return {
                codes,
                explanation: content,
            };
        } else {
            return {
                codes: await getCpp(id),
                explanation: content,
            };
        }
    } else {
        return {
            codes: await getCpp(id),
            explanation: "",
        };
    }
}

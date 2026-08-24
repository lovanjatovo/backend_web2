export interface Choice {
    id: number;
    content: string;
    isCorrect?: boolean;
};

export interface Question {
    id: number;
    examId: number;
    statement: string;
    points: number;
    choices: Choice[];
}
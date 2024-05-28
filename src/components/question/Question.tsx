import React, { useEffect, useState } from "react";
import _ from "lodash";
import "./Question.scss";

interface QuestionProps {
    hidden: boolean;
    setQuestionsCorrect: React.Dispatch<React.SetStateAction<number>>;
}

interface QuestionData {
    question: string;
    options: string[];
    reference: string;
}

export function Question({ hidden, setQuestionsCorrect }: QuestionProps) {
    const [questionData, setQuestionData] = useState<QuestionData[] | null>(
        null
    );
    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [question, setQuestion] = useState<string | null>(null);
    const [options, setOptions] = useState<[number, string][] | null>(null);
    const [reference, setReference] = useState<string | null>(null);
    const [answered, setAnswered] = useState<boolean>(false);
    const [selected, setSelected] = useState<number | null>(null);
    const [correct, setCorrect] = useState<boolean | null>(null);
    const [questionNumber, setQuestionNumber] = useState<number>(1);

    useEffect(() => {
        fetch("questions.csv")
            .then((response) => response.text())
            .then((data) =>
                setQuestionData(
                    _.shuffle(
                        data
                            .split("\n")
                            .filter((v) => v.length > 1)
                            .map((line: string) => {
                                const lineData = line.split(",");
                                return {
                                    question: lineData[0],
                                    options: lineData.slice(1, 5),
                                    reference: lineData[5],
                                };
                            })
                    )
                )
            );
    }, []);

    useEffect(() => {
        if (questionData) {
            let options = _.shuffle([
                ...questionData[questionIndex].options.entries(),
            ]);

            setQuestion(questionData[questionIndex].question);
            setOptions(options);
            setReference(questionData[questionIndex].reference);

            setQuestionIndex(questionIndex + 1);

            if (questionIndex >= 49) {
                setQuestionIndex(0);
                setQuestionData(_.shuffle(questionData));
            }
        }
    }, [questionData, questionNumber]);

    let onClick = (option: number) => () => {
        if (answered) return;

        setAnswered(true);
        setSelected(option);
        let correct = options?.filter((v) => v[0] == 0);
        if (correct![0][0] == option) {
            setQuestionsCorrect((prev) => prev + 1);
        }
        setCorrect(correct![0][0] == option);
    };

    return (
        <div id="question" hidden={hidden}>
            <h1>{question}</h1>
            <h2>
                <em>Reference: {reference}</em>
            </h2>
            <div className="container">
                {options?.map(([index, option]) => (
                    <div
                        className={`box${index == 0 ? " correctAnswer" : ""}${
                            answered ? " answered" : ""
                        }${index == selected ? " selected" : ""}`}
                        key={index}
                        onClick={onClick(index)}
                    >
                        {option}
                    </div>
                ))}
            </div>

            <h2>
                {correct != null ? (correct ? "Correct!" : "Incorrect!") : ""}
                <button
                    onClick={() => {
                        setQuestionNumber(questionNumber + 1);
                        setAnswered(false);
                        setCorrect(null);
                    }}
                    className="next"
                    disabled={!answered}
                >
                    Next
                </button>
            </h2>
        </div>
    );
}

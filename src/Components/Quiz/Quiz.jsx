import React, { useRef, useState } from 'react';
import './Quiz.css';
import { data } from '../../assets/data';

const Quiz = () => {
    let [index, setIndex] = useState(0);
    let [question, setQuestion] = useState(data[index]);
    let [lock, setLock] = useState(false);
    let [score, setScore] = useState(0);
    let [result, setResult] = useState(false);

    let [selectedOption, setSelectedOption] = useState(null);
    let [slideDirection, setSlideDirection] = useState(''); // Track slide direction

    let option1 = useRef(null);
    let option2 = useRef(null);
    let option3 = useRef(null);
    let option4 = useRef(null);

    let optionArray = [option1, option2, option3, option4];

    // Handle option selection
    const selectOption = (ans, ref) => {
        if (!lock) {
            setSelectedOption(ans);
            if (question.ans === ans) {
                ref.current.classList.add('correct');
                setScore(prev => prev + 1);
            } else {
                ref.current.classList.add('wrong');
                optionArray[question.ans - 1].current.classList.add('correct');
            }
            setLock(true);
        }
    };

    // Handle moving to the next question
    const next = () => {
        if (lock) {
            if (index === data.length - 1) {
                setResult(true);
            } else {
                setSlideDirection('next');
                setIndex(prevIndex => prevIndex + 1);
                setQuestion(data[index + 1]);
                setLock(false);
                setSelectedOption(null);
                optionArray.forEach(option => {
                    option.current.classList.remove('wrong');
                    option.current.classList.remove('correct');
                });
            }
        }
    };

    // Handle moving to the previous question
    const previous = () => {
        if (index > 0) {
            setSlideDirection('previous');
            setIndex(prevIndex => prevIndex - 1);
            setQuestion(data[index - 1]);
            setLock(false);
            setSelectedOption(null);
            optionArray.forEach(option => {
                option.current.classList.remove('wrong');
                option.current.classList.remove('correct');
            });
        }
    };

    // Reset the quiz
    const reset = () => {
        setIndex(0);
        setQuestion(data[0]);
        setScore(0);
        setLock(false);
        setResult(false);
        setSelectedOption(null);
        optionArray.forEach(option => {
            option.current.classList.remove('wrong');
            option.current.classList.remove('correct');
        });
    };

    return (
        <div className='container'>
            <h1>Quiz App</h1>
            <hr />
            {result ? (
                <>
                    <h2>You scored {score} out of {data.length}</h2>
                    <button onClick={reset}>Reset</button>
                </>
            ) : (
                <>
                    <h2>{index + 1}. {question.question}</h2>
                    <ul>
                        <li
                            ref={option1}
                            onClick={() => selectOption(1, option1)}
                            className={selectedOption === 1 ? 'selected' : ''}
                        >
                            {question.option1}
                        </li>
                        <li
                            ref={option2}
                            onClick={() => selectOption(2, option2)}
                            className={selectedOption === 2 ? 'selected' : ''}
                        >
                            {question.option2}
                        </li>
                        <li
                            ref={option3}
                            onClick={() => selectOption(3, option3)}
                            className={selectedOption === 3 ? 'selected' : ''}
                        >
                            {question.option3}
                        </li>
                        <li
                            ref={option4}
                            onClick={() => selectOption(4, option4)}
                            className={selectedOption === 4 ? 'selected' : ''}
                        >
                            {question.option4}
                        </li>
                    </ul>
                    <div className="navigation">
                        <button onClick={previous} disabled={index === 0}>Previous</button>
                        <button onClick={next} disabled={!lock}>Next</button>
                    </div>
                    <div className="index">{index + 1} of {data.length}</div>
                </>
            )}
        </div>
    );
};

export default Quiz;

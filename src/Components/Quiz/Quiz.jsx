import React, { useRef, useState } from 'react';
import './Quiz.css';  // Ensure you have the necessary styles here
import { data } from '../../assets/data';  // Import your quiz questions data
import axios from 'axios';  // For making API requests to the backend

const Quiz = () => {
    let [index, setIndex] = useState(0); // Current question index
    let [question, setQuestion] = useState(data[index]); // Current question
    let [lock, setLock] = useState(false); // Lock for selecting options
    let [score, setScore] = useState(0); // Score counter
    let [result, setResult] = useState(false); // Result flag to show quiz completion

    let [username, setUsername] = useState(''); // Store username
    let [userId, setUserId] = useState(null); // Store user ID after registration

    let option1 = useRef(null);
    let option2 = useRef(null);
    let option3 = useRef(null);
    let option4 = useRef(null);

    let optionArray = [option1, option2, option3, option4]; // All options for current question

    // Register user by sending a POST request to the backend
    const registerUser = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/register', { username });
            setUserId(response.data.id);
            console.log('User registered with ID:', response.data.id);
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Error registering user. Please try again.');
        }
    };

    // Save the score after the quiz is completed
    const saveScore = async () => {
        if (!userId) {
            console.error('User ID not available');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/save-score', { userId, score });
            console.log('Score saved successfully');
        } catch (error) {
            console.error('Error saving score:', error);
        }
    };

    // Handle option selection
    const selectOption = (ans, ref) => {
        if (!lock) {
            if (question.ans === ans) {
                ref.current.classList.add('correct');
                setScore(prev => prev + 1);  // Increase score for correct answer
            } else {
                ref.current.classList.add('wrong');
                optionArray[question.ans - 1].current.classList.add('correct');  // Show correct option
            }
            setLock(true);

            // Disable further clicks on options
            optionArray.forEach(option => {
                option.current.style.pointerEvents = 'none'; 
            });
        }
    };

    // Move to the next question or finish the quiz
    const next = () => {
        if (lock) {
            const nextIndex = index + 1;
            if (nextIndex === data.length) {
                setResult(true); // No need to display score
                saveScore(); // Save score when quiz ends
            } else {
                setIndex(nextIndex); // Update index first
                setQuestion(data[nextIndex]); // Then update question
                setLock(false);
                optionArray.forEach(option => {
                    option.current.classList.remove('wrong');
                    option.current.classList.remove('correct');
                    option.current.style.pointerEvents = 'auto'; // Enable option click
                });
            }
        }
    };

    // Reset the quiz
    const reset = () => {
        setIndex(0);
        setQuestion(data[0]);
        setScore(0);
        setLock(false);
        setResult(false);
        setUserId(null);
        setUsername('');  // Clear username
    
        optionArray.forEach(option => {
            option.current.classList.remove('wrong');
            option.current.classList.remove('correct');
            option.current.style.pointerEvents = 'auto';
        });
    };

    return (
        <div className='container'>
            <h1>Quiz App</h1>
            <hr />
            {userId ? (
                <>
                    {result ? (
                        <>
                            <h2>Quiz Finished!</h2>  {/* You can add a simple "Quiz Finished!" message */}
                            <button onClick={reset}>Reset</button>
                        </>
                    ) : (
                        <>
                            <h2>{index + 1}. {question.question}</h2>
                            <ul>
                                <li ref={option1} onClick={() => selectOption(1, option1)}>{question.option1}</li>
                                <li ref={option2} onClick={() => selectOption(2, option2)}>{question.option2}</li>
                                <li ref={option3} onClick={() => selectOption(3, option3)}>{question.option3}</li>
                                <li ref={option4} onClick={() => selectOption(4, option4)}>{question.option4}</li>
                            </ul>
                            <button onClick={next} disabled={!lock}>Next</button>
                            <div className="index">{index + 1} of {data.length}</div>
                        </>
                    )}
                </>
            ) : (
                <div>
                    <h2>Enter your username to start the quiz:</h2>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <button onClick={registerUser}>Start Quiz</button>
                </div>
            )}
        </div>
    );
};

export default Quiz;

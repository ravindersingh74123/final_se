// import { Link } from "react-router-dom";
// import GenderCheckbox from "./GenderCheckbox";
// import { useState } from "react";
// import useSignup from "../../hooks/useSignup";

// const SignUp = () => {
// 	const [inputs, setInputs] = useState({
// 		fullName: "",
// 		username: "",
// 		password: "",
// 		confirmPassword: "",
// 		gender: "",
// 	});

// 	const { loading, signup } = useSignup();

// 	const handleCheckboxChange = (gender) => {
// 		setInputs({ ...inputs, gender });
// 	};

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
// 		await signup(inputs);
// 	};

// 	return (
// 		<div className='signup'>
// 			<div className='signup-container'>
// 				<h1 className='signup-head'>
// 					Sign Up <span className='signup-head-span'> ChatApp</span>
// 				</h1>

// 				<form className="signup-form" onSubmit={handleSubmit}>
// 					<div className="signup-fhead">
// 						<label className='sign-label'>
// 							<span className="signup-form-span">Full Name</span>
// 						</label>
// 						<input
// 							type='text'
// 							placeholder='John Doe'
// 							className='labael-sign-input'
// 							value={inputs.fullName}
// 							onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
// 						/>
// 					</div>

// 					<div className="signup-more">
// 						<label className='more-label '>
// 							<span className="signup-more-span" >Username</span>
// 						</label>
// 						<input
// 							type='text'
// 							placeholder='johndoe'
// 							className='more-input'
// 							value={inputs.username}
// 							onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
// 						/>
// 					</div>

// 					<div>
// 						<label className='more-morelabel'>
// 							<span className='more-span'>Password</span>
// 						</label>
// 						<input
// 							type='password'
// 							placeholder='Enter Password'
// 							className='more-moreinput'
// 							value={inputs.password}
// 							onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
// 						/>
// 					</div>

// 					<div>
// 						<label className='more-squarelabel'>
// 							<span className='more-sqaurespan'>Confirm Password</span>
// 						</label>
// 						<input
// 							type='password'
// 							placeholder='Confirm Password'
// 							className='more-sqaureinput'
// 							value={inputs.confirmPassword}
// 							onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
// 						/>
// 					</div>

// 					<GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />

// 					<Link
// 						to={"/login"}
// 						className='signup-link'
// 						href='#'
// 					>
// 						Already have an account?
// 					</Link>

// 					<div className="signup-btn">
// 						<button className='btn-btn' disabled={loading}>
// 							{loading ? <span className='signup-loading'></span> : "Sign Up"}
// 						</button>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	);
// };
// export default SignUp;

import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import { useState } from "react";
import useSignup from "../../hooks/useSignup";
import { z } from "zod";

const SignUp = () => {
    const [inputs, setInputs] = useState({
        fullName: "",
        username: "",
        password: "",
        confirmPassword: "",
        gender: "",
    });

    const { loading, signup } = useSignup();

    const schema = z.object({
        fullName: z.string(),
        username: z.string().email(), // Ensure the username is a valid email address
        password: z.string(),
        confirmPassword: z.string(),
        gender: z.string(),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Validate form data against the schema
            schema.parse(inputs);
            await signup(inputs);
        } catch (error) {
            console.error("Form validation failed:", error);
            // Handle validation errors here
			alert("please enter correct username");
            return;
        }
    };

    return (
        <div className='signup'>
            <div className='signup-container'>
                <h1 className='signup-head'>
                    Sign Up <span className='signup-head-span'> ChatApp</span>
                </h1>

                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="signup-fhead">
                        <label className='sign-label'>
                            <span className="signup-form-span">Full Name</span>
                        </label>
                        <input
                            type='text'
                            placeholder='John Doe'
                            className='labael-sign-input'
                            value={inputs.fullName}
                            onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
                        />
                    </div>

                    <div className="signup-more">
                        <label className='more-label '>
                            <span className="signup-more-span" >Username (Email)</span>
                        </label>
                        <input
                            type='text'
                            placeholder='johndoe@example.com'
                            className='more-input'
                            value={inputs.username}
                            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className='more-morelabel'>
                            <span className='more-span'>Password</span>
                        </label>
                        <input
                            type='password'
                            placeholder='Enter Password'
                            className='more-moreinput'
                            value={inputs.password}
                            onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className='more-squarelabel'>
                            <span className='more-sqaurespan'>Confirm Password</span>
                        </label>
                        <input
                            type='password'
                            placeholder='Confirm Password'
                            className='more-sqaureinput'
                            value={inputs.confirmPassword}
                            onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
                        />
                    </div>

                    <GenderCheckbox onCheckboxChange={(gender) => setInputs({ ...inputs, gender })} selectedGender={inputs.gender} />

                    <Link
                        to={"/login"}
                        className='signup-link'
                        href='#'
                    >
                        Already have an account?
                    </Link>

                    <div className="signup-btn">
                        <button className='btn-btn' disabled={loading}>
                            {loading ? <span className='signup-loading'></span> : "Sign Up"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default SignUp;


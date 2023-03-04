import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { registerUser } from "../../features/auth/authActions";
import { reset } from "../../features/auth/authSlice";

const defaultFormFields = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
const SignUp = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [formErrors, setFormErrors] = useState({});

  const { user, error, success, message } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      handleError(message);
    }

    if (success && user) {
      navigate("/welcome");
    }

    return () => {
      dispatch(reset());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, message, user, success, navigate, dispatch]);

  const handleError = (message) => {
    // alert(message);
    // Parse the erroe message string
    const messageObject = JSON.parse(message);
    Object.keys(messageObject).forEach((item) => {
      changeBorderColorOnError(item);
    });

    setFormErrors(messageObject);
  };

  const changeBorderColorOnError = (inputName) => {
    let formInput = document.getElementById(`${inputName}`);
    formInput.classList.add("error");
  };

  // const handleValidation = () => {
  //   let error = {};

  //   if (!formFields.name) {
  //     error.name = "Name is required!";
  //     changeBorderColorOnError("name");
  //   }

  //   if (!formFields.email) {
  //     error.email = "Email is required!";
  //     changeBorderColorOnError("email");
  //   }

  //   if (!formFields.password) {
  //     error.password = "Password is required!";
  //     changeBorderColorOnError("password");
  //   }

  //   if (!formFields.confirmPassword) {
  //     error.confirmPassword = "Please confirm your password!";
  //     changeBorderColorOnError("confirmPassword");
  //   }

  //   return error;
  // };

  const handleInputValueChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // setFormErrors(handleValidation());
    dispatch(registerUser(formFields));
  };

  return (
    <section>
      <h1 className="form-heading">Create an Account</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-item" id="name">
          <label>Name</label>
          <input type="text" placeholder="Enter your name" name="name" value={formFields.name} onChange={handleInputValueChange} />
          <span className="error-text">{formErrors.name}</span>
        </div>

        <div className="form-item" id="email">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" name="email" value={formFields.email} onChange={handleInputValueChange} />
          <span className="error-text">{formErrors.email}</span>
        </div>

        <div className="form-item" id="password">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" name="password" value={formFields.password} onChange={handleInputValueChange} />
          <span className="error-text">{formErrors.password}</span>
        </div>

        <div className="form-item" id="confirmPassword">
          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm your password" name="confirmPassword" value={formFields.confirmPassword} onChange={handleInputValueChange} />
          <span className="error-text">{formErrors.confirmPassword}</span>
        </div>

        <button type="submit" className="form-button">
          Sign Up
        </button>
      </form>
    </section>
  );
};

export default SignUp;

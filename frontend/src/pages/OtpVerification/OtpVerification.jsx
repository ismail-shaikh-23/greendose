import React, { useEffect, useRef, useState } from "react";
import styles from "./OtpVerification.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "@/lib/toast";
import "./OtpVerification.module.scss";
import BackArrowIcon from "../../components/SVGComponents/BackArrowIcon";
import { combineClasses, onlyNumbersInput, requiredMessage } from "@/lib/utils";
import Button from "@/components/Button/Button";
import routes from "@/routes/routes";
import AuthService from "@/services/api/auth";
import loginLogo from "@/assets/png/login_logo.png";
const otpLength = 4;

const OtpVerification = () => {
  const [otp, setOtp] = useState(Array(otpLength).fill(""));
  const navigate = useNavigate();
  const location = useLocation();
  const email = location?.state?.email;

  const refArray = Array.from({ length: otpLength }, () =>
    React.createRef(null)
  );

  useEffect(() => {
    if (!email) {
      toast.error("Email not found. Please try again.");
      return () => {
        navigate(routes.publicRoutes.FORGOT_PASSWORD.path);
      };
    }
    refArray[0]?.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length < otpLength) return;
    try {
      const res = await AuthService.verifyOtp({
        email,
        otp: otpString,
      });

      if (res?.success) {
        toast.success("OTP verified successfully");
        navigate(routes.publicRoutes.RESET_PASSWORD.path, {
          state: { email },
        });
      } else {
        toast.error(res.message || "Invalid OTP.");
      }
    } catch (err) {
      toast.error(err.message || "OTP verification failed.");
    }
  };

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    if (value.length <= 1) {
      otp[name] = value;
      setOtp([...otp]);
      if (value && name < otpLength - 1) {
        refArray[+name + 1].current.focus();
      }
    }
  };
const isFilled = otp.every((val) => val.trim().length > 0);

  return (
    <div className={styles.mainDiv}>
      <BackArrowIcon
        className={styles.backIcon}
        onClick={() => {
          navigate(-1);
        }}
      />
      <div className={styles.login_logo}>
                <img alt="logo" src={loginLogo} width={320} />{" "}
              </div>
            <p className={styles.heading}>Wellness for All Waste for None</p>
          
      {/* <p className={styles.heading}>Enter OTP</p>
      <p className={styles.subHeading}>OTP has been sent to</p> */}
      <p className={styles.selectedEmail}>
        {email}
        <span className="link-text"> Change</span>
      </p>
        <p className={styles.subHeading}>Enter verification code here</p>
      <form className={styles.form} autoComplete="off" onSubmit={handleSubmit}>
        <div className={styles.inputsContainer}>
          {Array.from({ length: otpLength }).map((_, i) => (
            <input
              key={i}
              name={i}
              ref={refArray[i]}
              type="number"
              value={otp[i]}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                onlyNumbersInput(e);
                if (e.key === "Backspace" && !otp[i] && i > 0) {
                  refArray[+i - 1].current.focus();
                }
              }}
              onPaste={(e) => {
                const pastedText = e.clipboardData
                  .getData("Text")
                  .slice(0, otpLength);
                setOtp(pastedText.split(""));
                refArray[pastedText.length - 1].current.focus();
              }}
            />
          ))}
        </div>
        <Button type="submit"   className={combineClasses(styles.button, isFilled && styles.activeButton)}>
          Submit
        </Button>
        <p className={styles.bottomText}>
          Didn't get OTP? <span className="link-text">Resend</span>
        </p>
      </form>
    </div>
  );
};

export default OtpVerification;

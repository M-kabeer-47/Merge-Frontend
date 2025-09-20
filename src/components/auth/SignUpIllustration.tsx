import React from 'react';

const SignUpIllustration = () => {
  return (
    <div className="flex flex-col h-full p-8">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-xl font-raleway font-semibold text-heading">Merge</span>
        </div>
      </div>
      
      {/* Centered Illustration */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <img 
            src="/illustrations/sign-up-illustration.png" 
            alt="Sign up illustration" 
            className="w-full h-auto animate-in fade-in duration-700"
          />
        </div>
      </div>
      
      {/* Bottom Text */}
      <div className="text-center relative top-[-130px]">
        <h2 className="text-2xl font-raleway font-semibold text-heading mb-2">
          Join Our Community
        </h2>
        <p className="text-normal-text-muted">
          Connect, learn, and grow with students and instructors worldwide
        </p>
      </div>
    </div>
  );
};

export default SignUpIllustration;
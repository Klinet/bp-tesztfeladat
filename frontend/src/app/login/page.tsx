"use client";

import React, { useEffect, useState } from 'react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('loginData');
    if (saved) {
      const { email, password } = JSON.parse(saved);
      setEmail(email);
      setPassword(password);
      setRemember(true);
    }
  }, []);

  useEffect(() => {
    if (!remember) {
      localStorage.removeItem('loginData');
    }
  }, [remember]);

  console.log("Render - showPassword useState:", showPassword);

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const containerStyle = { background: 'linear-gradient(90deg, #12326E 0%, #03194D 100%)' };
  const backgroundEmblemStyle = { bottom: 0, right: 0, width: '472px', height: '622px' };
  const contentWrapperStyle = { top: 160 };
  const logoContainerStyle = { width: '75.05px', height: '48px' };
  const headingContainerStyle = { width: '146px', height: '30px', marginTop: '12px' };
  const headingStyle = {
    fontFamily: 'Source Sans Pro',
    fontWeight: 600,
    fontSize: '24px',
    lineHeight: '30px',
    letterSpacing: '0.01em',
    color: '#ffffff',
  };
  const modalBgStyle = { top: '114px', width: '448px', height: '352px', borderColor: '#DDDDDD' };
  const inputContainerBaseStyle = { left: '50%', transform: 'translateX(-200px)', width: '400px', height: '76px' };
  const labelBaseClass = "text-base font-semibold text-[#12326E]";
  const labelClass = "text-base text-[#12326E]";
  const inputBaseClass = "w-full border border-gray-300 rounded px-3 py-3 text-base";
  const checkboxContainerStyle = { top: '350px', left: '50%', transform: 'translateX(-200px)', width: 'auto', height: '20px' };
  const checkboxStyle = { width: '16px', height: '16px', borderRadius: '3px', border: '1px solid grey' };
  const submitButtonContainerStyle = { top: '390px', left: '50%', transform: 'translateX(-200px)', width: '400px' };

  return (
    <div
      className="min-h-screen w-full h-screen flex items-center justify-center relative overflow-hidden"
      style={containerStyle}
    >
      <div className="absolute" style={backgroundEmblemStyle}>
        <img src="/images/bg-image.svg" alt="háttér embléma" className="w-full h-full object-contain" />
      </div>

      <div
        className="absolute w-full max-w-[448px] flex flex-col items-center lx-center"
        style={contentWrapperStyle}
      >
        <div className="flex flex-col items-center justify-center mb-4">
          <div style={logoContainerStyle}>
            <img src="/00/logo/badge-colored.svg" alt="logo" className="w-full h-full object-contain" />
          </div>
          <div style={headingContainerStyle}>
            <h1 className="text-center" style={headingStyle}>Bejelentkezés</h1>
          </div>
        </div>

        <div className="absolute bg-white border rounded" style={modalBgStyle} />

        <form
          onSubmit={async (e) => {
            e.preventDefault();

            if (remember) {
              localStorage.setItem('loginData', JSON.stringify({ email, password }));
            } else {
              localStorage.removeItem('loginData');
            }

            const res = await fetch('http://localhost:3001/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            setStatusMessage(data.message);
          }}
        >
          <div className="absolute flex flex-col gap-2" style={{ ...inputContainerBaseStyle, top: 150 }}>
            <label className={labelBaseClass} htmlFor="email">E-mail cím:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputBaseClass}
              placeholder="email@pelda.hu"
            />
          </div>
          <div className="absolute flex flex-col gap-2" style={{ ...inputContainerBaseStyle, top: 250 }}>
            <label className={labelBaseClass} htmlFor="password">Jelszó:</label>
            <div className="relative w-full">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputBaseClass} pr-10`}
                placeholder="Jelszo"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Jelszó elrejtése" : "Jelszó megjelenítése"}
              >
                <img
                  src="/images/visibility_icon.png"
                  alt={showPassword ? "Jelszó elrejtése ikon" : "Jelszó megjelenítése ikon"}
                  className="h-5 w-5"
                />
              </button>
            </div>
          </div>
          <div className="absolute flex items-center gap-2" style={checkboxContainerStyle}>
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={checkboxStyle}
            />
            <label htmlFor="remember" className={labelClass}>Emlékezzen rám</label>
          </div>
          <div className="absolute" style={submitButtonContainerStyle}>
            <button
              type="submit"
              disabled={statusMessage === 'Sikeres bejelentkezés'}
              className={`w-full py-3 rounded text-base font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2
    ${statusMessage === 'Sikeres bejelentkezés'
                ? 'bg-green-500 text-white !text-white cursor-default'
                : 'bg-[#00B6DE] hover:bg-[#00a5c8] text-white !text-white focus:ring-[#00B6DE]'
              }`}
            >
              Bejelentkezés
            </button>

            {statusMessage && (
              <div
                className={`mt-4 w-full px-4 py-2 rounded text-sm font-medium text-center ${
                  statusMessage === 'Sikeres bejelentkezés'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {statusMessage}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
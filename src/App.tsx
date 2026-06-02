import React, { useEffect, useRef, useState } from 'react';
import { AuthComponent } from './components/auth.js';
import { DashboardComponent } from './components/dashboard.js';
import { LandingComponent } from './components/landing.js';
import { Store } from './utils/store.js';
import { AuraAnimations } from './utils/animations.js';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [route, setRoute] = useState<'landing' | 'login' | 'register' | 'dashboard'>('landing');

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // Clear container
    container.innerHTML = '';

    if (route === 'landing') {
      LandingComponent.render(
        container, 
        () => setRoute('login'), 
        () => setRoute('register')
      );
      AuraAnimations.initLanding();
    } else if (route === 'login') {
      AuthComponent.renderLogin(
        container,
        (user: any) => setRoute('dashboard'),
        () => setRoute('register'),
        () => setRoute('landing')
      );
      AuraAnimations.initAuth();
    } else if (route === 'register') {
      AuthComponent.renderRegister(
        container,
        (user: any) => setRoute('dashboard'),
        () => setRoute('login'),
        () => setRoute('landing')
      );
      AuraAnimations.initAuth();
    } else if (route === 'dashboard') {
      DashboardComponent.render(
        container,
        () => setRoute('landing')
      );
      AuraAnimations.initDashboard();
    }

  }, [route]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

import React from 'react';
import Link from 'next/link';
import GitHubLink from './GitHubLink';

const LandingHeroCard = () => (
  <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
    <div className="max-w-2xl w-full bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl p-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-white">
          This is a test task for <span className="text-blue-400">Digital Suits</span>
        </h1>

        <p className="text-lg text-gray-200">
          A simple todo application built with Next.js, Express, and PostgreSQL.
          This project demonstrates a full-stack application with a modern tech stack.
        </p>

        <div className="pt-4 space-y-4">
          <Link
            href="/tasks"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Tasks
          </Link>

          <GitHubLink />
        </div>
      </div>
    </div>
  </div>
);

export default LandingHeroCard; 
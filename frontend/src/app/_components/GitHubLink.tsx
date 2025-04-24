import React from 'react';
import { GitHubIcon } from '@/components/icons/GitHubIcon';

// Component for the GitHub link
export const GitHubLink: React.FC = () => {
  return (
    <div>
      <a
        href="https://github.com/dhamidullin/ds-test"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-gray-200 hover:underline flex items-center justify-center gap-2"
      >
        <GitHubIcon />
        View on GitHub
      </a>
    </div>
  );
}; 
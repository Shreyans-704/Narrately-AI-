/**
 * Video Configuration for ShortsVideoGrid
 * 
 * Edit this file to change the videos displayed on the website.
 * Add, remove, or modify videos by updating the array below.
 * 
 * Each video object requires:
 * - videoUrl: Direct link to the video file (MP4, WebM, etc.)
 * - title: Display title of the video
 * - views: View count text (e.g., "1.2M views")
 * - link: Navigation link (use '#' for now)
 */

export type ShortsVideo = {
  videoUrl: string;
  title: string;
  views: string;
  link: string;
};

export const DEFAULT_SHORTS_VIDEOS: ShortsVideo[] = [
  {
    videoUrl: 'https://cdn.pixabay.com/video/2024/12/15/246869_large.mp4',
    title: 'AI Podcast Mastery',
    views: '2.8M views',
    link: '#',
  },
  {
    videoUrl: 'https://cdn.pixabay.com/video/2024/12/15/246869_large.mp4',
    title: 'AI Voice to Content',
    views: '1.5M views',
    link: '#',
  },
  {
    videoUrl: 'https://cdn.pixabay.com/video/2024/12/15/246869_large.mp4',
    title: 'AI Podcast Magic',
    views: '3.2M views',
    link: '#',
  },
  {
    videoUrl: 'https://cdn.pixabay.com/video/2024/12/15/246869_large.mp4',
    title: 'Create & Distribute',
    views: '956K views',
    link: '#',
  },
];

/**
 * QUICK EDIT:
 * To add or change videos, modify the DEFAULT_SHORTS_VIDEOS array above.
 * 
 * EXAMPLE:
 * {
 *   videoUrl: 'https://your-video-url.mp4',
 *   title: 'Your Video Title',
 *   views: '100K views',
 *   link: 'https://your-video-link.mp4',
 * }
 */

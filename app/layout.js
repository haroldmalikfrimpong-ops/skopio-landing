import './globals.css';

export const metadata = {
  title: 'Skopio — The Simple Client Portal for Freelancers',
  description: 'Give every client a branded portal. AI writes your proposals in 10 seconds. Project status, invoicing, file sharing — all in one link. Starting at $19/month.',
  keywords: 'client portal, freelancer tools, AI proposals, invoicing, project management, freelance',
  openGraph: {
    title: 'Skopio — The Simple Client Portal for Freelancers',
    description: 'Give every client a branded portal. AI writes your proposals in 10 seconds. Starting at $19/month.',
    url: 'https://skopio.co',
    siteName: 'Skopio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skopio — The Simple Client Portal for Freelancers',
    description: 'AI writes your proposals in 10 seconds. Starting at $19/month.',
    creator: '@skopioapp',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

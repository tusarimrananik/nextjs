import { FC } from 'react';

interface SocialLink {
  name: string;
  href: string;
  logo: string;
}

const SocialLinks: FC = () => {
  const links: SocialLink[] = [
    {
      name: 'Facebook',
      href: '/facebook',
      logo: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'
    },
    {
      name: 'Gmail',
      href: '/gmail',
      logo: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'
    },
    {
      name: 'WhatsApp',
      href: '/whatsapp',
      logo: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884'
    },
    {
      name: 'Imo',
      href: '/imo',
      logo: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z'
    }
  ];

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg border border-border shadow-lg">
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Hack Accounts</h2>
      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_self"
            rel="noopener noreferrer"
            className="flex items-center p-4 rounded-lg transition-colors duration-200 hover:bg-accent hover:text-accent-foreground border border-border"
          >
            <div
              className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground mr-4"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-current"
                role="img"
                aria-label={`${link.name} logo`}
              >
                <path d={link.logo} />
              </svg>
            </div>
            <span className="font-medium text-foreground">{link.name}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default SocialLinks;
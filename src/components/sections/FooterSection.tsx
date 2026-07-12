import React from 'react';
import Link from 'next/link';
import { Facebook, Youtube, Linkedin, Twitter, Instagram } from 'lucide-react';
import Image from 'next/image';
import type { Dictionary } from '@/i18n/config';

const FooterSection: React.FC<{ dict: Dictionary }> = ({ dict }) => {
  const f = dict.footer;
  return (
    <footer className="bg-card py-12 md:py-16 lg:py-10 mt-20 border-t border-border">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
          {/* 왼쪽 섹션 - 로고 */}
          <div className="lg:w-3/10 mb-8 lg:mb-0">
            <div className="flex items-center mb-4">
              <Image src="/logo/allincalc6.png" alt="AllinCalc Logo" width={250} height={100} />
            </div>
          </div>

          {/* 오른쪽 섹션 - 링크 그룹 */}
          <div className="lg:w-7/10 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="hidden sm:block"></div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-4">{f.press}</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">{f.editorialPolicy}</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">{f.partnership}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground mb-4">{f.about}</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">{f.intro}</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">{f.library}</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">{f.affiliate}</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">{f.contact}</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground">{f.blog}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} AllinCalc. {f.copyright}
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;

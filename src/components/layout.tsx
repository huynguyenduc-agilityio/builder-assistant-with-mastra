import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import UserMenu from './user-menu';

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex flex-col py-4 lg:py-0 lg:flex-row h-26 lg:h-18 shrink-0 items-start lg:items-center gap-2">
          <div className="flex items-center justify-between w-full gap-2 px-4">
            <div className="flex items-center gap-2">
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <div className="flex flex-row gap-2 items-center">
                <h1 className="font-bold text-xl">DevDay Assistant</h1>
              </div>
            </div>
            <UserMenu />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}


import { ReactNode } from 'react'
import MainLayout from '../layouts/MainLayout'

interface LayoutProps {
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  centerContent?: ReactNode;
  children?: ReactNode;
}

const MainLayoutWrapper = ({ leftContent, rightContent, centerContent, children }: LayoutProps) => {
  return (
    <MainLayout 
      leftContent={leftContent}
      rightContent={rightContent}
      centerContent={centerContent}
    >
      {children}
    </MainLayout>
  )
}

export default MainLayoutWrapper
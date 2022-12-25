import Breadcrumbs from "components/Breadcrumbs/Breadcrumbs"
import Header from "components/Header/Header"
import container from "styles/container.module.css"

type Props = {
  children: React.ReactNode
}

const MainRootLayout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <div className={container.pageContainer}>
        <Breadcrumbs />
        {children}
      </div>
    </>
    )
}

export default MainRootLayout


import { Outlet } from "react-router"
import AppHeader from "../components/layouts/AppHeader"
export default function AppLayouts() {
  return (
    <>
       <AppHeader/>
       <Outlet/>
    </>
  )
}

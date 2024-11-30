import { BasicLayout } from "../_components/basic-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BasicLayout>{children}</BasicLayout>;
}

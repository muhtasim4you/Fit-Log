import MyPlan from "../../components/my-plan";

export default async function MyPlanPage({ searchParams }) {
  const { tab } = await searchParams;

  return <MyPlan initialTab={tab === "saved" ? "saved" : "plan"} />;
}

import SignUp from "./SignUp";
import NoInvitation from "./NoInvitation";

const SignUpPage = async ({ searchParams }) => {
  const params = await searchParams;
  const token = params?.token;

  if (!token) {
    return <NoInvitation />;
  }

  return <SignUp token={token} />;
};
export default SignUpPage;

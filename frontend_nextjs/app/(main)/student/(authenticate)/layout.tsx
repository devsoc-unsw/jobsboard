import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import api, { authTokenKey } from 'config/api';

type AuthenticateStudentLayoutProps = {
  children: React.ReactNode;
};

async function authenticate() {
  const authToken = cookies().get(authTokenKey)?.value || '';
  try {
    const res = await api.get(`/jobs/0`, {
      headers: {
        Authorization: authToken
      }
    });
    if (res.status === 200) return true;
  } catch (e) {
    console.log('Error at authentucate');
  }
  return false;
}

const AuthenticateStudentLayout = async ({ children }: AuthenticateStudentLayoutProps) => {
  if (!(await authenticate())) {
    redirect('/student/login');
  }
  return children;
};

export default AuthenticateStudentLayout;

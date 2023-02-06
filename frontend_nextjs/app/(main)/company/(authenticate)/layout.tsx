import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import api, { authTokenKey } from 'config/api';

type AuthenticateCompanyLayoutProps = {
  children: React.ReactNode;
};

async function authenticate() {
  const authToken = cookies().get(authTokenKey)?.value || '';
  try {
    const res = await api.get(`/companyjobs`, {
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

const AuthenticateCompanyLayout = async ({ children }: AuthenticateCompanyLayoutProps) => {
  if (!(await authenticate())) {
    redirect('/company/login');
  }
  return children;
};

export default AuthenticateCompanyLayout;

import DomHead from '../components/DomHead';
import Footer from '../components/Footer';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import Bubbles from '../components/Bubbles';

export default function ForgotPassword() {
	return (
		<div>
			<DomHead
				pageMeta={{
					title: 'CRYPTOOL | FORGOT PASSWORD',
					description: 'Cryptool forgot password page'
				}}
			/>
			<main>
				<Bubbles />
				<ForgotPasswordForm />
				<div className="spacer layer1"></div>
			</main>
			<Footer />
			<div className="cursor"></div>
		</div>
	);
}

import DomHead from '../src/components/DomHead'
import Footer from '../src/components/Footer'
import ForgotPasswordForm from '../src/components/ForgotPasswordForm'
import Bubbles from '../src/components/Bubbles'

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
	)
}

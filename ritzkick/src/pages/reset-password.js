import DomHead from '../src/components/DomHead'
import Footer from '../src/components/Footer'
import Bubbles from '../src/components/Bubbles'
import ResetPasswordForm from '../src/components/ResetPasswordForm'

export default function ForgotPassword() {
	return (
		<div>
			<DomHead
				pageMeta={{
					title: 'CRYPTOOL | RESET PASSWORD',
					description: 'Cryptool reset password page'
				}}
			/>
			<main>
				<Bubbles />
				<ResetPasswordForm />
				<div className="spacer layer1"></div>
			</main>
			<Footer />
			<div className="cursor"></div>
		</div>
	)
}

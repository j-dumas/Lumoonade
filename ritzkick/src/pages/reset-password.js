import DomHead from '@/components/DomHead'
import Footer from '@/components/Footer'
import Bubbles from '@/components/Bubbles'
import ResetPasswordForm from '@/components/ResetPasswordForm'

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

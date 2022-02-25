import DomHead from '../src/components/DomHead'
import Footer from '../src/components/Footer'
import Bubbles from '../src/components/Bubbles'
import EmailConfirmationCard from '../src/components/EmailConfirmationCard'

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
				<EmailConfirmationCard />
				<div className="spacer layer1"></div>
			</main>
			<Footer />
			<div className="cursor"></div>
		</div>
	)
}

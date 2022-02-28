import DomHead from '@/components/DomHead'
import Footer from '@/components/Footer'
import Bubbles from '@/components/Bubbles'
import EmailConfirmationCard from '@/components/EmailConfirmationCard'

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

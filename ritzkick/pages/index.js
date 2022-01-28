import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
	console.log(process.env.PORT)
	return (
		<div className={styles.container}>
			<h1>Test</h1>
		</div>
	)
}

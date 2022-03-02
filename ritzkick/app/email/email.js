const sendgrid = require('@sendgrid/mail')
const logger = require('../../utils/logging')

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

// https://codepen.io/md-khokon/pen/bPLqzV (Template de courriel)

const sendConfirmationEmail = (to, link) => {
	sendgrid
		.send({
			to,
			from: process.env.SENDGRID_EMAIL_SENDER,
			subject: 'Bienvenue !',
			html: `
            	<!DOCTYPE html>
					<html>
						<head>
							<meta charset="utf-8" />
							<meta http-equiv="x-ua-compatible" content="ie=edge" />
							<title>Confirmation de votre courriel</title>
							<meta name="viewport" content="width=device-width, initial-scale=1" />
							<style type="text/css">
								body,
								table,
								td,
								a {
									-ms-text-size-adjust: 100%; /* 1 */
									-webkit-text-size-adjust: 100%; /* 2 */
								}
								table,
								td {
									mso-table-rspace: 0pt;
									mso-table-lspace: 0pt;
								}
								img {
									-ms-interpolation-mode: bicubic;
								}
								a[x-apple-data-detectors] {
									font-family: inherit !important;
									font-size: inherit !important;
									font-weight: inherit !important;
									line-height: inherit !important;
									color: inherit !important;
									text-decoration: none !important;
								}
								/**
					 * Fix centering issues in Android 4.4.
					 */
								div[style*='margin: 16px 0;'] {
									margin: 0 !important;
								}
								body {
									width: 100% !important;
									height: 100% !important;
									padding: 0 !important;
									margin: 0 !important;
								}
								/**
					 * Collapse table borders to avoid space between cells.
					 */
								table {
									border-collapse: collapse !important;
								}
								a {
									color: #bf55ec;
								}
								img {
									height: auto;
									line-height: 100%;
									text-decoration: none;
									border: 0;
									outline: none;
								}
							</style>
						</head>
						<body style="background-color: #131415">
							<!-- start preheader -->
							<div
								class="preheader"
								style="
									display: none;
									max-width: 0;
									max-height: 0;
									overflow: hidden;
									font-size: 1px;
									line-height: 1px;
									color: #131415;
									opacity: 0;
								"
							>
								Bienvenue chez Lumoonade ! Veuillez confirmer votre adresse courriel.
							</div>
							<!-- end preheader -->

							<!-- start body -->
							<table border="0" cellpadding="0" cellspacing="0" width="100%">
								<tr>
									<td align="center" bgcolor="#131415">
										<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
											<tr>
												<td align="center" valign="top" style="padding: 36px 24px"></td>
											</tr>
										</table>
									</td>
								</tr>

								<!-- start hero -->
								<tr>
									<td align="center" bgcolor="#131415">
										<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
											<tr>
												<td
													align="left"
													bgcolor="#1c1d1f"
													style="
														padding: 36px 24px 0;
														font-family: Amaranth, Arial, Helvetica, sans-serif;
														border-top: 3px solid ##1c1d1f;
													"
												>
													<h1
														style="
															margin-left: 3;
															margin: 0;
															font-size: 32px;
															font-weight: 700;
															letter-spacing: -1px;
															line-height: 48px;
															color: #ffffff;
														"
													>
														Bienvenue chez Lumoonade
													</h1>
												</td>
											</tr>
										</table>
										<!--[if (gte mso 9)|(IE)]>
							</td>
							</tr>
							</table>
							<![endif]-->
									</td>
								</tr>
								<!-- end hero -->

								<!-- start copy block -->
								<tr>
									<td align="center" bgcolor="#131415">
										<!--[if (gte mso 9)|(IE)]>
							<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
							<tr>
							<td align="center" valign="top" width="600">
							<![endif]-->
										<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
											<!-- start copy -->
											<tr>
												<td
													align="left"
													bgcolor="#1c1d1f"
													style="
														padding: 24px;
														font-family: Amaranth, Arial, Helvetica, sans-serif;
														font-size: 16px;
														line-height: 24px;
													"
												>
													<p style="margin: 0; color: #ffffff">
														Cliquez sur le bouton ci-dessous pour confirmer votre adresse courriel. Si vous
														n'avez pas créé de compte avec <a href="https://lumoonade.com">Lumoonade</a>, vous
														pouvez supprimer ce courriel.
													</p>
												</td>
											</tr>
											<!-- end copy -->

											<!-- start button -->
											<tr>
												<td align="left" bgcolor="#131415">
													<table border="0" cellpadding="0" cellspacing="0" width="100%">
														<tr>
															<td align="center" bgcolor="#1c1d1f" style="padding: 12px">
																<table border="0" cellpadding="0" cellspacing="0">
																	<tr>
																		<td align="center" bgcolor="#bf55ec" style="border-radius: 6px">
																			<a
																				href="${link}"
																				target="_blank"
																				style="
																					display: inline-block;
																					padding: 16px 36px;
																					font-family: Amaranth, Arial, Helvetica, sans-serif;
																					font-size: 16px;
																					color: #ffffff;
																					text-decoration: none;
																					border-radius: 6px;
																				"
																				>Confirmer</a
																			>
																		</td>
																	</tr>
																</table>
															</td>
														</tr>
													</table>
												</td>
											</tr>
											<!-- end button -->

											<!-- start copy -->
											<tr>
												<td
													align="left"
													bgcolor="#1c1d1f"
													style="
														padding: 24px;
														font-family: Amaranth, Arial, Helvetica, sans-serif;
														font-size: 16px;
														line-height: 24px;
													"
												>
													<p style="margin: 0; color: #ffffff">
														Si le bouton ne fonctionne pas, copiez et collez le lien suivant dans votre
														navigateur:
													</p>
													<p style="margin: 0"><a href="${link}" target="_blank">${link}</a></p>
												</td>
											</tr>
											<!-- end copy -->

											<!-- start copy -->
											<tr>
												<td
													align="left"
													bgcolor="#1c1d1f"
													style="
														padding: 24px;
														font-family: Amaranth, Arial, Helvetica, sans-serif;
														font-size: 16px;
														line-height: 24px;
														border-bottom: 3px solid #1c1d1f;
													"
												>
													<p style="margin: 0; color: #ffffff">
														Bonne journée,<br />
														Lumoonade
													</p>
												</td>
											</tr>
											<!-- end copy -->
										</table>
									</td>
								</tr>
								<!-- end copy block -->

								<!-- start footer -->
								<tr>
									<td align="center" bgcolor="#131415" style="padding: 24px">
										<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
											<!-- start permission -->
											<tr>
												<td
													align="center"
													bgcolor="#131415"
													style="
														padding: 12px 24px;
														font-family: Amaranth, Arial, Helvetica, sans-serif;
														font-size: 14px;
														line-height: 20px;
														color: #666;
													"
												>
													<p style="margin: 0">
														Vous avez reçu ce courriel parce que nous avons reçu une demande d'inscription pour
														votre compte. Si vous ne vous êtes pas inscrit, vous pouvez supprimer ce courriel.
													</p>
												</td>
											</tr>
											<!-- end permission -->
										</table>
									</td>
								</tr>
								<!-- end footer -->
							</table>
							<!-- end body -->
						</body>
					</html>
        	`
		})
		.then((res) => {
			logger.info('Email', `Email sent to ${to}!`)
		})
		.catch((_) => {})
}

/**
 * Send an email to the user for reset password purposes.
 * @param {string} to
 */
const sendResetPasswordEmail = (to, link) => {
	sendgrid
		.send({
			to,
			from: process.env.SENDGRID_EMAIL_SENDER,
			subject: 'Reset Password',
			html: `
            <!DOCTYPE html>
				<html>
					<head>
						<meta charset="utf-8" />
						<meta http-equiv="x-ua-compatible" content="ie=edge" />
						<title>Nouveau mot de passe</title>
						<meta name="viewport" content="width=device-width, initial-scale=1" />
						<style type="text/css">
							body,
							table,
							td,
							a {
								-ms-text-size-adjust: 100%; /* 1 */
								-webkit-text-size-adjust: 100%; /* 2 */
							}
							table,
							td {
								mso-table-rspace: 0pt;
								mso-table-lspace: 0pt;
							}
							img {
								-ms-interpolation-mode: bicubic;
							}
							a[x-apple-data-detectors] {
								font-family: inherit !important;
								font-size: inherit !important;
								font-weight: inherit !important;
								line-height: inherit !important;
								color: inherit !important;
								text-decoration: none !important;
							}
							/**
				 * Fix centering issues in Android 4.4.
				 */
							div[style*='margin: 16px 0;'] {
								margin: 0 !important;
							}
							body {
								width: 100% !important;
								height: 100% !important;
								padding: 0 !important;
								margin: 0 !important;
							}
							/**
				 * Collapse table borders to avoid space between cells.
				 */
							table {
								border-collapse: collapse !important;
							}
							a {
								color: #bf55ec;
							}
							img {
								height: auto;
								line-height: 100%;
								text-decoration: none;
								border: 0;
								outline: none;
							}
						</style>
					</head>
					<body style="background-color: #131415">
						<!-- start preheader -->
						<div
							class="preheader"
							style="
								display: none;
								max-width: 0;
								max-height: 0;
								overflow: hidden;
								font-size: 1px;
								line-height: 1px;
								color: #131415;
								opacity: 0;
							"
						>
							Réinitialisation de votre mot de passe
						</div>
						<!-- end preheader -->

						<!-- start body -->
						<table border="0" cellpadding="0" cellspacing="0" width="100%">
							<tr>
								<td align="center" bgcolor="#131415">
									<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
										<tr>
											<td align="center" valign="top" style="padding: 36px 24px"></td>
										</tr>
									</table>
								</td>
							</tr>

							<!-- start hero -->
							<tr>
								<td align="center" bgcolor="#131415">
									<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
										<tr>
											<td
												align="left"
												bgcolor="#1c1d1f"
												style="
													padding: 36px 24px 0;
													font-family: Amaranth, Arial, Helvetica, sans-serif;
													border-top: 3px solid ##1c1d1f;
												"
											>
												<h1
													style="
														margin-left: 3;
                            margin: 0;
														font-size: 32px;
														font-weight: 700;
														letter-spacing: -1px;
														line-height: 48px;
														color: #ffffff;
													"
												>
													Bonjour,
												</h1>
											</td>
										</tr>
									</table>
									<!--[if (gte mso 9)|(IE)]>
						</td>
						</tr>
						</table>
						<![endif]-->
								</td>
							</tr>
							<!-- end hero -->

							<!-- start copy block -->
							<tr>
								<td align="center" bgcolor="#131415">
									<!--[if (gte mso 9)|(IE)]>
						<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
						<tr>
						<td align="center" valign="top" width="600">
						<![endif]-->
									<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
										<!-- start copy -->
										<tr>
											<td
												align="left"
												bgcolor="#1c1d1f"
												style="
													padding: 24px;
													font-family: Amaranth, Arial, Helvetica, sans-serif;
													font-size: 16px;
													line-height: 24px;
												"
											>
												<p style="margin: 0; color: #ffffff">
													Voici le lien pour réinitialiser votre mot de passe: <a href="${link}">réinitialisation</a>.
												</p>
                    </br>
                        <p style="margin: 0; color: #ffffff">
													Le lien sera actif pour une courte durée.
												</p>
											</td>
										</tr>
										<!-- end copy -->

										<!-- start copy -->
										<tr>
											<td
												align="left"
												bgcolor="#1c1d1f"
												style="
													padding: 24px;
													font-family: Amaranth, Arial, Helvetica, sans-serif;
													font-size: 16px;
													line-height: 24px;
													border-bottom: 3px solid #1c1d1f;
												"
											>
												<p style="margin: 0; color: #ffffff">
													Bonne journée,<br />
													Lumoonade
												</p>
											</td>
										</tr>
										<!-- end copy -->
									</table>
								</td>
							</tr>
							<!-- end copy block -->

							<!-- start footer -->
							<tr>
								<td align="center" bgcolor="#131415" style="padding: 24px">
									<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
										<!-- start permission -->
										<tr>
											<td
												align="center"
												bgcolor="#131415"
												style="
													padding: 12px 24px;
													font-family: Amaranth, Arial, Helvetica, sans-serif;
													font-size: 14px;
													line-height: 20px;
													color: #666;
												"
											>
												<p style="margin: 0">
													Vous avez reçu ce courriel parce que nous avons reçu une demande de réinitialisation de mot de passe pour votre compte. Si vous n'avez pas fait de demande, vous pouvez supprimer ce courriel et vérifier les accès à votre compte.
												</p>
											</td>
										</tr>
										<!-- end permission -->
									</table>
								</td>
							</tr>
							<!-- end footer -->
						</table>
						<!-- end body -->
					</body>
				</html>
        `
		})
		.then((res) => {
			logger.info('Email', `Email sent to ${to}!`)
		})
		.catch((_) => {})
}

/**
 * Send an email to the user for watchlist notification purposes.
 * @param {object} config
 */
const sendWatchlistNotificationMessage = (config = { to, asked, price, assetName }) => {
	sendgrid
		.send({
			to: config.to,
			from: process.env.SENDGRID_EMAIL_SENDER,
			subject: 'Alerte !',
			html: `
            <!DOCTYPE html>
				<html>
					<head>
						<meta charset="utf-8" />
						<meta http-equiv="x-ua-compatible" content="ie=edge" />
						<title>Alerte pour ${config.assetName}</title>
						<meta name="viewport" content="width=device-width, initial-scale=1" />
						<style type="text/css">
							body,
							table,
							td,
							a {
								-ms-text-size-adjust: 100%; /* 1 */
								-webkit-text-size-adjust: 100%; /* 2 */
							}
							table,
							td {
								mso-table-rspace: 0pt;
								mso-table-lspace: 0pt;
							}
							img {
								-ms-interpolation-mode: bicubic;
							}
							a[x-apple-data-detectors] {
								font-family: inherit !important;
								font-size: inherit !important;
								font-weight: inherit !important;
								line-height: inherit !important;
								color: inherit !important;
								text-decoration: none !important;
							}
							/**
				 * Fix centering issues in Android 4.4.
				 */
							div[style*='margin: 16px 0;'] {
								margin: 0 !important;
							}
							body {
								width: 100% !important;
								height: 100% !important;
								padding: 0 !important;
								margin: 0 !important;
							}
							/**
				 * Collapse table borders to avoid space between cells.
				 */
							table {
								border-collapse: collapse !important;
							}
							a {
								color: #bf55ec;
							}
							img {
								height: auto;
								line-height: 100%;
								text-decoration: none;
								border: 0;
								outline: none;
							}
						</style>
					</head>
					<body style="background-color: #131415">
						<!-- start preheader -->
						<div
							class="preheader"
							style="
								display: none;
								max-width: 0;
								max-height: 0;
								overflow: hidden;
								font-size: 1px;
								line-height: 1px;
								color: #131415;
								opacity: 0;
							"
						>
							Votre cryptomonnaie a atteint le prix demandé.
						</div>
						<!-- end preheader -->

						<!-- start body -->
						<table border="0" cellpadding="0" cellspacing="0" width="100%">
							<tr>
								<td align="center" bgcolor="#131415">
									<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
										<tr>
											<td align="center" valign="top" style="padding: 36px 24px"></td>
										</tr>
									</table>
								</td>
							</tr>

							<!-- start hero -->
							<tr>
								<td align="center" bgcolor="#131415">
									<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
										<tr>
											<td
												align="left"
												bgcolor="#1c1d1f"
												style="
													padding: 36px 24px 0;
													font-family: Amaranth, Arial, Helvetica, sans-serif;
													border-top: 3px solid ##1c1d1f;
												"
											>
												<h1
													style="
														margin-left: 3;
                            margin: 0;
														font-size: 32px;
														font-weight: 700;
														letter-spacing: -1px;
														line-height: 48px;
														color: #ffffff;
													"
												>
													Bonjour,
												</h1>
											</td>
										</tr>
									</table>
									<!--[if (gte mso 9)|(IE)]>
						</td>
						</tr>
						</table>
						<![endif]-->
								</td>
							</tr>
							<!-- end hero -->

							<!-- start copy block -->
							<tr>
								<td align="center" bgcolor="#131415">
									<!--[if (gte mso 9)|(IE)]>
						<table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
						<tr>
						<td align="center" valign="top" width="600">
						<![endif]-->
									<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
										<!-- start copy -->
										<tr>
											<td
												align="left"
												bgcolor="#1c1d1f"
												style="
													padding: 24px;
													font-family: Amaranth, Arial, Helvetica, sans-serif;
													font-size: 16px;
													line-height: 24px;
												"
											>
												<p style="margin: 0; color: #ffffff">
													Votre cryptomonnaie (${config.assetName}) a atteint le prix demandé (${config.asked}$). </br> La valeur actuelle est de ${config.price}$.
												</p>
											</td>
										</tr>
										<!-- end copy -->

										<!-- start copy -->
										<tr>
											<td
												align="left"
												bgcolor="#1c1d1f"
												style="
													padding: 24px;
													font-family: Amaranth, Arial, Helvetica, sans-serif;
													font-size: 16px;
													line-height: 24px;
													border-bottom: 3px solid #1c1d1f;
												"
											>
												<p style="margin: 0; color: #ffffff">
													Bonne journée,<br />
													Lumoonade
												</p>
											</td>
										</tr>
										<!-- end copy -->
									</table>
								</td>
							</tr>
							<!-- end copy block -->

							<!-- start footer -->
							<tr>
								<td align="center" bgcolor="#131415" style="padding: 24px">
									<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
										<!-- start permission -->
										<tr>
											<td
												align="center"
												bgcolor="#131415"
												style="
													padding: 12px 24px;
													font-family: Amaranth, Arial, Helvetica, sans-serif;
													font-size: 14px;
													line-height: 20px;
													color: #666;
												"
											>
												<p style="margin: 0">
													Vous avez reçu ce courriel parce que nous avons reçu une demande d'alerte pour
													votre compte. Si vous n'avez pas fait de demande, vous pouvez supprimer ce courriel.
												</p>
											</td>
										</tr>
										<!-- end permission -->
									</table>
								</td>
							</tr>
							<!-- end footer -->
						</table>
						<!-- end body -->
					</body>
				</html>
        `
		})
		.then((res) => {
			logger.info('Email', `Email sent to ${config.to}!`)
		})
		.catch((_) => {})
}

module.exports = {
	sendResetPasswordEmail,
	sendWatchlistNotificationMessage,
	sendConfirmationEmail
}

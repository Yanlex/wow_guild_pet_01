/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Page from './Components/Page/Page';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import MplusTop from './Components/MplusTop/MplusTop';
import AboutGuild from './Components/AboutGuild/AboutGuild';
import Guides from './Components/Guides/Guides';

export default function App() {
	const homePageTitle = (
		<p>
			Приветствуем вас в обновленной гильдии ⭐ Ключик в дурку ⭐ - устремленной к профессионализму
			и полному погружению в мир World of Warcraft. Мы эволюционировали из казуальной группы в семью
			настоящих семи-хардкорных игроков.
		</p>
	);

	const [data, setData] = useState(null);

	useEffect(() => {
		const authCheck = async () => {
			const response = await fetch('http://localhost:3000/redis', {
				credentials: 'same-origin',
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			});
			const data = await response.json();
		};
		authCheck();
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={
						<Page>
							<Header title="ГИЛЬДИЯ КЛЮЧИК В ДУРКУ" p={homePageTitle} />
							<main role="main">
								<AboutGuild />
								<MplusTop />
							</main>
							<Footer />
						</Page>
					}
				/>
				<Route
					path="/guides"
					element={
						<Page>
							<Header
								title="ГАЙДЫ"
								p="Полезная информация о вашем КЛАССЕ / СПЕКЕ. Бис шмот, трини. Ссылки на полезные ресурсы на рейдовый и групповой контент."
							/>
							<main role="main">
								<Guides />
							</main>
							<Footer />
						</Page>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}

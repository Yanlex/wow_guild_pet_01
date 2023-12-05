import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface mtopslice {
	slice: [number, number];
	olstart: number;
}

function MplusTopList({ slice, olstart }: mtopslice) {
	const [guildData, setGuildData] = useState(null);
	const id = uuidv4();

	function fetchData() {
		fetch('http://localhost:3000/guild-data')
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then((data) => {
				setGuildData(data);
			})
			.catch((error) => {
				console.log(`Ошибка fetchData guild-data ${error}`);
			});
	}

	useEffect(() => {
		fetchData();
	}, []);

	const classIcons: Record<string, string> = {
		'Death Knight': 'classicon_deathknight',
		'Demon Hunter': 'classicon_demonhunter',
		Druid: 'classicon_druid',
		Evoker: 'classicon_evoker',
		Hunter: 'classicon_hunter',
		Mage: 'classicon_mage',
		Monk: 'classicon_monk',
		Paladin: 'classicon_paladin',
		Priest: 'classicon_priest',
		Rogue: 'classicon_rogue',
		Shaman: 'classicon_shaman',
		Warlock: 'classicon_warlock',
		Warrior: 'classicon_warrior',
	};

	if (!guildData) {
		return <div>Loading...</div>;
	}

	// Сортировка по Рио
	guildData.sort(
		(a: { mythic_plus_score_dfs3: number }, b: { mythic_plus_score_dfs3: number }) =>
			b.mythic_plus_score_dfs3 - a.mythic_plus_score_dfs3,
	);
	const filtredGuild = guildData.filter(
		(member: { player_guild: string; class: string }) => member.player_guild === 'Ключик в дурку',
	);
	console.log(filtredGuild);
	const topmplusgigachads = filtredGuild.slice(slice[0], slice[1]);
	return (
		<>
			{' '}
			<ol className="topmplus__main_flex" start={olstart}>
				{topmplusgigachads
					.filter((member: { player_guild: string }) => member.player_guild === 'Ключик в дурку')
					.map(
						(member: {
							id: React.Key;
							class: string;
							character_name: string;
							mythic_plus_score_dfs3: number;
						}) => (
							<li key={id} className="topmplus__row">
								<img
									src={`http://localhost:3000/class/${classIcons[member.class]}.jpg`}
									alt=""
									className="topmplus__classicon"
								/>
								<div className="topmplus__nickname">{member.character_name}</div>
								<div className="topmplus__main-rio">{member.mythic_plus_score_dfs3.toFixed()}</div>
							</li>
						),
					)}
			</ol>
		</>
	);
}

export default MplusTopList;

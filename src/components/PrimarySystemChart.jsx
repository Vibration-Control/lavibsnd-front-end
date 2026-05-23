import React, { useMemo, useState } from 'react'
import { useWatch } from 'react-hook-form'
import { Button } from 'react-bootstrap'
import { complex, add, divide, abs, multiply } from 'mathjs'

import {
	Chart as ChartJS,
	LineElement,
	PointElement,
	LinearScale,
	CategoryScale,
	Tooltip,
	Legend,
	Title
} from 'chart.js'

import { Line } from 'react-chartjs-2'

ChartJS.register(
	LineElement,
	PointElement,
	LinearScale,
	CategoryScale,
	Tooltip,
	Legend,
	Title
)

const PrimarySystemChart = ({ control }) => {
	const [chartResult, setChartResult] = useState(null)

	const [frfType, setFrfType] = useState('receptance')

	const naturalFrequencies =
		useWatch({
			control,
			name: 'primarySystemNaturalFrequencies'
		}) || []

	const modalDamping =
		useWatch({
			control,
			name: 'primarySystemModalDamping'
		}) || []

	const modes =
		useWatch({
			control,
			name: 'primarySystemModes'
		}) || []

	const parsedModes = useMemo(() => {
		return modes.map((mode) => {
			if (Array.isArray(mode)) return mode

			try {
				return JSON.parse(mode)
			} catch {
				return []
			}
		})
	}, [modes])

	const responseNode = 0
	const excitationNode = 0

	const isValid = useMemo(() => {
		if (!naturalFrequencies.length) return false
		if (!parsedModes.length) return false

		return naturalFrequencies.every(
			(freq) =>
				freq !== '' &&
				!isNaN(freq)
		)
	}, [naturalFrequencies, parsedModes])

	const calculateFRF = () => {
		const numberOfModes =
			naturalFrequencies.length

		const minFrequency =
			Math.min(...naturalFrequencies) * 0.8

		const maxFrequency =
			Math.max(...naturalFrequencies) * 1.2

		const frequencyDiscretization = 1000

		const frequencies = Array.from(
			{ length: frequencyDiscretization },
			(_, i) =>
				minFrequency +
				((maxFrequency - minFrequency) * i) /
				(frequencyDiscretization - 1)
		)

		const frf = frequencies.map((frequency) => {
			const omega =
				2 * Math.PI * frequency

			let receptance = complex(0, 0)

			for (let j = 0; j < numberOfModes; j++) {
				const fn =
					naturalFrequencies[j]

				const zeta =
					modalDamping[j] || 0

				const omegaN =
					2 * Math.PI * fn

				const phiR =
					parsedModes[j]?.[responseNode] ?? 0

				const phiE =
					parsedModes[j]?.[excitationNode] ?? 0

				// Modal denominator:
				// (ωn² - ω²) + i(2ζωnω)

				const denominator = complex(
					omegaN * omegaN -
					omega * omega,

					2 *
					zeta *
					omegaN *
					omega
				)

				const modalContribution =
					phiR * phiE

				const modalFRF = divide(
					modalContribution,
					denominator
				)

				receptance = add(
					receptance,
					modalFRF
				)
			}

			let magnitude = abs(receptance)

			const db =
				20 *
				Math.log10(
					magnitude || 1e-16
				)

			return db
		})

		setChartResult({
			frequencies,
			receptance: frf
		})
	}

	const removeChart = () => {
		setChartResult(null)
	}

	const chartData = useMemo(() => {
		if (!chartResult) return null

		const transformedFRF =
			chartResult.receptance.map(
				(value, index) => {
					const frequency =
						chartResult.frequencies[index]

					const omega =
						2 *
						Math.PI *
						frequency

					let transformedValue = value

					if (frfType === 'mobility') {
						transformedValue =
							value +
							20 *
							Math.log10(
								omega
							)
					}

					if (frfType === 'inertance') {
						transformedValue =
							value +
							40 *
							Math.log10(
								omega
							)
					}

					return transformedValue
				}
			)

		return {
			labels: chartResult.frequencies,

			datasets: [
				{
					label: `Primary System ${frfType}`,

					data: transformedFRF,

					borderColor:
						'rgba(75,192,192,1)',

					borderWidth: 2,

					fill: false,

					tension: 0.2,

					pointRadius: 0
				}
			]
		}
	}, [chartResult, frfType])

	const chartOptions = useMemo(() => ({
		responsive: true,
		maintainAspectRatio: false,

		plugins: {
			legend: {
				position: 'top'
			},

			tooltip: {
				mode: 'index',
				intersect: false
			}
		},

		scales: {
			x: {
				title: {
					display: true,
					text: 'Frequency (Hz)'
				},

				ticks: {
					callback: function (
						value,
						index,
						ticks
					) {
						const totalTicks = 20

						const step =
							Math.floor(
								ticks.length /
								totalTicks
							)

						return index % step === 0
							? this.getLabelForValue(
								value
							)
							: ''
					},

					autoSkip: false
				}
			},

			y: {
				title: {
					display: true,

					text:
						frfType === 'receptance'
							? 'Receptance (dB) ref. 1[m/N]'
							: frfType ===
								'mobility'
								? 'Mobility (dB) ref. 1[m/s/N]'
								: 'Inertance (dB) ref. 1[m/s²/N]'
				}
			}
		}
	}), [frfType])

	return (
		<div className="mt-4">
			<div className="d-flex gap-2 mb-3">
				<Button
					variant="primary"
					onClick={calculateFRF}
					disabled={!isValid}
				>
					Plot FRF
				</Button>

				{chartResult && (
					<Button
						variant="danger"
						onClick={removeChart}
					>
						Remove Chart
					</Button>
				)}
			</div>

			{chartResult && (
				<>
					<div className="mb-3">
						<div className="form-check form-check-inline">
							<input
								className="form-check-input"
								type="radio"
								name="frfType"
								id="receptance"
								value="receptance"
								checked={
									frfType ===
									'receptance'
								}
								onChange={(e) =>
									setFrfType(
										e.target.value
									)
								}
							/>

							<label
								className="form-check-label"
								htmlFor="receptance"
							>
								Receptance
							</label>
						</div>

						<div className="form-check form-check-inline">
							<input
								className="form-check-input"
								type="radio"
								name="frfType"
								id="mobility"
								value="mobility"
								checked={
									frfType ===
									'mobility'
								}
								onChange={(e) =>
									setFrfType(
										e.target.value
									)
								}
							/>

							<label
								className="form-check-label"
								htmlFor="mobility"
							>
								Mobility
							</label>
						</div>

						<div className="form-check form-check-inline">
							<input
								className="form-check-input"
								type="radio"
								name="frfType"
								id="inertance"
								value="inertance"
								checked={
									frfType ===
									'inertance'
								}
								onChange={(e) =>
									setFrfType(
										e.target.value
									)
								}
							/>

							<label
								className="form-check-label"
								htmlFor="inertance"
							>
								Inertance
							</label>
						</div>
					</div>

					<div className="card mb-4">
						<div
							className="card-body"
							style={{
								height: '500px'
							}}
						>
							<Line
								data={chartData}
								options={chartOptions}
							/>
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default PrimarySystemChart
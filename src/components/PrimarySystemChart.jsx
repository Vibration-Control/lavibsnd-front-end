import React, { useMemo, useState } from 'react'
import { useWatch } from 'react-hook-form'
import { Button } from 'react-bootstrap'

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

import annotationPlugin from 'chartjs-plugin-annotation'

import { Line } from 'react-chartjs-2'

import {
	complex,
	add,
	divide,
	abs
} from 'mathjs'

ChartJS.register(
	LineElement,
	PointElement,
	LinearScale,
	CategoryScale,
	Tooltip,
	Legend,
	Title,
	annotationPlugin
)

const PrimarySystemChart = ({
	control,
	setValue
}) => {
	const [chartResult, setChartResult] =
		useState(null)

	const [frfType, setFrfType] =
		useState('receptance')

	const [selectionMode, setSelectionMode] =
		useState(false)

	const [selectionStep, setSelectionStep] =
		useState(0)

	const [selectionMessage, setSelectionMessage] =
		useState('')

	const plotLowerBound =
		useWatch({
			control,
			name: 'plotLowerBound'
		}) ?? 1

	const plotUpperBound =
		useWatch({
			control,
			name: 'plotUpperBound'
		}) ?? 60

	const objectiveFunctionSearchLowerBound =
		useWatch({
			control,
			name:
				'objectiveFunctionSearchLowerBound'
		}) ?? 10

	const objectiveFunctionSearchUpperBound =
		useWatch({
			control,
			name:
				'objectiveFunctionSearchUpperBound'
		}) ?? 30

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
			if (Array.isArray(mode)) {
				return mode
			}

			try {
				return JSON.parse(mode)
			} catch {
				return []
			}
		})
	}, [modes])

	const responseNode = 0
	const excitationNode = 0

	const selectionSteps = [
		{
			key: 'plotLowerBound',
			message:
				'Select Plot Lower Bound'
		},
		{
			key: 'plotUpperBound',
			message:
				'Select Plot Upper Bound'
		},
		{
			key:
				'objectiveFunctionSearchLowerBound',
			message:
				'Select Optimization Lower Bound'
		},
		{
			key:
				'objectiveFunctionSearchUpperBound',
			message:
				'Select Optimization Upper Bound'
		}
	]

	const isValid = useMemo(() => {
		if (!naturalFrequencies.length)
			return false

		if (!parsedModes.length)
			return false

		return naturalFrequencies.every(
			(freq) =>
				freq !== '' &&
				!isNaN(freq)
		)
	}, [
		naturalFrequencies,
		parsedModes
	])

	const calculateFRF = () => {
		const numberOfModes =
			naturalFrequencies.length

		const minFrequency =
			Math.min(
				...naturalFrequencies
			) * 0.8

		const maxFrequency =
			Math.max(
				...naturalFrequencies
			) * 1.2

		const frequencyDiscretization = 1000

		const frequencies = Array.from(
			{
				length:
					frequencyDiscretization
			},
			(_, i) =>
				minFrequency +
				((maxFrequency -
					minFrequency) *
					i) /
				(frequencyDiscretization -
					1)
		)

		const receptance =
			frequencies.map(
				(frequency) => {
					const omega =
						2 *
						Math.PI *
						frequency

					let frf =
						complex(0, 0)

					for (
						let j = 0;
						j < numberOfModes;
						j++
					) {
						const fn =
							naturalFrequencies[j]

						const zeta =
							modalDamping[j] ||
							0

						const omegaN =
							2 *
							Math.PI *
							fn

						const phiR =
							parsedModes[j]?.[
							responseNode
							] ?? 0

						const phiE =
							parsedModes[j]?.[
							excitationNode
							] ?? 0

						const denominator =
							complex(
								omegaN *
								omegaN -
								omega *
								omega,

								2 *
								zeta *
								omegaN *
								omega
							)

						const modalContribution =
							phiR * phiE

						const modalFRF =
							divide(
								modalContribution,
								denominator
							)

						frf = add(
							frf,
							modalFRF
						)
					}

					const magnitude =
						abs(frf)

					const db =
						20 *
						Math.log10(
							magnitude ||
							1e-16
						)

					return db
				}
			)

		setChartResult({
			frequencies,
			receptance,
			minFrequency,
			maxFrequency
		})
	}

	const removeChart = () => {
		setChartResult(null)

		stopSelectionMode()
	}

	const startSelectionMode = () => {
		setSelectionMode(true)

		setSelectionStep(0)

		setSelectionMessage(
			selectionSteps[0].message
		)
	}

	const stopSelectionMode = () => {
		setSelectionMode(false)

		setSelectionStep(0)

		setSelectionMessage('')
	}

	const chartData = useMemo(() => {
		if (!chartResult) return null

		const transformedFRF =
			chartResult.receptance.map(
				(value, index) => {
					const frequency =
						chartResult
							.frequencies[
						index
						]

					const omega =
						2 *
						Math.PI *
						frequency

					let transformedValue =
						value

					if (
						frfType ===
						'mobility'
					) {
						transformedValue =
							value +
							20 *
							Math.log10(
								omega
							)
					}

					if (
						frfType ===
						'inertance'
					) {
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
			datasets: [
				{
					label: `Primary System ${frfType}`,

					parsing: false,

					data:
						chartResult.frequencies.map(
							(frequency, index) => ({
								x: Number(frequency),
								y: Number(
									transformedFRF[index]
								)
							})
						),

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

	const handleChartClick = (
		event,
		elements,
		chart
	) => {
		if (!selectionMode) return

		if (!elements.length) return

		const element = elements[0]

		const index = element.index

		const clickedFrequency =
			chart.data.datasets[0]
				.data[index].x

		const currentStep =
			selectionSteps[
			selectionStep
			]

		setValue(
			currentStep.key,
			clickedFrequency
		)

		const nextStep =
			selectionStep + 1

		if (
			nextStep >=
			selectionSteps.length
		) {
			stopSelectionMode()
			return
		}

		setSelectionStep(nextStep)

		setSelectionMessage(
			selectionSteps[nextStep]
				.message
		)
	}

	const chartOptions = useMemo(
		() => ({
			responsive: true,

			maintainAspectRatio: false,

			onClick:
				handleChartClick,

			plugins: {
				legend: {
					position: 'top'
				},

				tooltip: {
					mode: 'index',
					intersect: false
				},

				annotation: {
					annotations: {
						plotLowerBound: {
							type: 'line',

							xMin:
								plotLowerBound,

							xMax:
								plotLowerBound,

							borderColor:
								'green',

							borderWidth: 2,

							label: {
								display: true,

								content:
									'Plot Lower'
							}
						},

						plotUpperBound: {
							type: 'line',

							xMin:
								plotUpperBound,

							xMax:
								plotUpperBound,

							borderColor:
								'green',

							borderWidth: 2,

							label: {
								display: true,

								content:
									'Plot Upper'
							}
						},

						controlLowerBound: {
							type: 'line',

							xMin:
								objectiveFunctionSearchLowerBound,

							xMax:
								objectiveFunctionSearchLowerBound,

							borderColor:
								'red',

							borderWidth: 2,

							label: {
								display: true,

								content:
									'Control Lower'
							}
						},

						controlUpperBound: {
							type: 'line',

							xMin:
								objectiveFunctionSearchUpperBound,

							xMax:
								objectiveFunctionSearchUpperBound,

							borderColor:
								'red',

							borderWidth: 2,

							label: {
								display: true,

								content:
									'Control Upper'
							}
						}
					}
				}
			},

			scales: {
				x: {
					type: 'linear',

					offset: false,

					min: Number(
						chartResult?.minFrequency
					),

					max: Number(
						chartResult?.maxFrequency
					),

					title: {
						display: true,
						text: 'Frequency (Hz)'
					},

					ticks: {
						precision: 2
					}
				},

				y: {
					title: {
						display: true,

						text:
							frfType ===
								'receptance'
								? 'Receptance (dB) ref. 1[m/N]'
								: frfType ===
									'mobility'
									? 'Mobility (dB) ref. 1[m/s/N]'
									: 'Inertance (dB) ref. 1[m/s²/N]'
					}
				}
			}
		}),
		[
			frfType,
			plotLowerBound,
			plotUpperBound,
			objectiveFunctionSearchLowerBound,
			objectiveFunctionSearchUpperBound,
			selectionMode,
			selectionStep
		]
	)

	return (
		<div className="mt-4">
			<div className="d-flex gap-2 mb-3">
				<Button
					variant="primary"
					onClick={
						calculateFRF
					}
					disabled={!isValid}
				>
					Plot FRF
				</Button>

				{chartResult && (
					<>
						<Button
							variant="danger"
							onClick={
								removeChart
							}
						>
							Remove Chart
						</Button>

						<Button
							variant={
								selectionMode
									? 'danger'
									: 'warning'
							}
							onClick={() => {
								if (
									selectionMode
								) {
									stopSelectionMode()
								} else {
									startSelectionMode()
								}
							}}
						>
							{selectionMode
								? 'Stop Selection'
								: 'Select Bounds'}
						</Button>
					</>
				)}
			</div>

			{selectionMode && (
				<div className="alert alert-info">
					<strong>
						{
							selectionMessage
						}
					</strong>
				</div>
			)}

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
								onChange={(
									e
								) =>
									setFrfType(
										e
											.target
											.value
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
								onChange={(
									e
								) =>
									setFrfType(
										e
											.target
											.value
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
								onChange={(
									e
								) =>
									setFrfType(
										e
											.target
											.value
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
								height:
									'500px'
							}}
						>
							<Line
								data={
									chartData
								}
								options={
									chartOptions
								}
							/>
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default PrimarySystemChart
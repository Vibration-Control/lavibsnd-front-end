export const autofillOptimizationData = (
    getValues,
    setValue
) => {
    const currentValues = getValues();

    const isEmpty = (value) =>
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0);

    const fillIfEmpty = (path, value) => {
        const current = getValues(path);

        if (isEmpty(current)) {
            setValue(path, value);
        }
    };

    // =====================================================
    // PRIMARY SYSTEM
    // =====================================================

    let naturalFrequencies =
        currentValues.primarySystemNaturalFrequencies;

    if (isEmpty(naturalFrequencies)) {
        naturalFrequencies = [10, 20, 40];

        setValue(
            "primarySystemNaturalFrequencies",
            naturalFrequencies
        );

        fillIfEmpty(
            "primarySystemModalDamping",
            [0.01, 0.01, 0.01]
        );

        fillIfEmpty(
            "primarySystemModes",
            [
                [0.1, 0.1],
                [0.1, 0.1],
                [0.1, 0.1],
            ]
        );
    }

    const minFreq = Math.min(...naturalFrequencies);
    const maxFreq = Math.max(...naturalFrequencies);

    // =====================================================
    // OPTIMIZATION RANGE
    // =====================================================

    const optimizationLower = Math.max(
        0,
        minFreq * 0.8
    );

    const optimizationUpper = maxFreq * 1.2;

    fillIfEmpty(
        "objectiveFunctionSearchLowerBound",
        optimizationLower
    );

    fillIfEmpty(
        "objectiveFunctionSearchUpperBound",
        optimizationUpper
    );

    fillIfEmpty(
        "objectiveFunctionSearchDiscretization",
        500
    );

    // =====================================================
    // PLOT RANGE
    // =====================================================

    fillIfEmpty(
        "plotLowerBound",
        Math.max(0, minFreq * 0.8)
    );

    fillIfEmpty(
        "plotUpperBound",
        maxFreq * 1.2
    );

    fillIfEmpty(
        "plotDiscretization",
        2000
    );

    // =====================================================
    // NODES
    // =====================================================

    fillIfEmpty(
        "excitationNodeOptimization",
        1
    );

    fillIfEmpty(
        "responseNodeOptimization",
        1
    );

    fillIfEmpty(
        "excitationNodePlot",
        1
    );

    fillIfEmpty(
        "responseNodePlot",
        1
    );

    fillIfEmpty(
        "plotType",
        1
    );

    // =====================================================
    // TEMPERATURE DETUNING
    // =====================================================

    fillIfEmpty(
        "additionalParameters.temperatureDetuning",
        [263, 313]
    );

    // =====================================================
    // NEUTRALIZER
    // =====================================================

    if (isEmpty(currentValues.neutralizers)) {
        const frequencyLowerBound = Math.max(
            0,
            optimizationLower * 0.8
        );

        const frequencyUpperBound =
            optimizationUpper * 1.2;

        const modalPositions = Array.from(
            { length: naturalFrequencies.length },
            (_, i) => i
        ).slice(1, -1);

        setValue("neutralizers", [
            {
                mass: 0.1,
                massTypeUserDefined: false,

                optimizationVariables: {
                    real: [
                        {
                            name: "frequency",
                            lowerBound:
                                frequencyLowerBound,
                            upperBound:
                                frequencyUpperBound,
                            discretization: 500,
                        },
                        {
                            name: "damp",
                            lowerBound: 0.01,
                            upperBound: 0.3,
                            discretization: 100,
                        },
                        {
                            name: "shape_factor",
                            lowerBound: 0.1,
                            upperBound: 10,
                            discretization: 200,
                        },
                    ],

                    integer: [
                        {
                            name: "type",
                            range: [1, 2, 3, 4],
                        },
                        {
                            name: "modal_position",
                            range: modalPositions,
                        },
                        {
                            name: "modal_position_tip",
                            range: modalPositions,
                        },
                    ],
                },

                checked: false,
                dynamicStiffness: "",
            },
        ]);
    }

    // =====================================================
    // GENETIC ALGORITHM
    // =====================================================

    fillIfEmpty(
        "geneticAlgorithm.populationSize",
        5
    );

    fillIfEmpty(
        "geneticAlgorithm.generations",
        20
    );

    fillIfEmpty(
        "geneticAlgorithm.crossover",
        60
    );

    fillIfEmpty(
        "geneticAlgorithm.mutation",
        5
    );
};
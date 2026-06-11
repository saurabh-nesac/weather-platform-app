//frontend-react/src/core/state/datasetStore.ts
import { create } from "zustand";
import type {
    Dataset,
} from "../datasets/datasetTypes";



interface DatasetStore {
    availableDatasets: Dataset[];

    selectedDatasetId: string | null;

    addDataset: (
        dataset: Dataset
    ) => void;

    removeDataset: (
        datasetId: string
    ) => void;

    selectDataset: (
        datasetId: string | null
    ) => void;

    clearDatasets: () => void;

    reset: () => void;
}

const initialState = {
    availableDatasets: [],
    selectedDatasetId: null,
};

export const useDatasetStore =
    create<DatasetStore>((set) => ({
        ...initialState,

        addDataset: (dataset) =>
            set((state) => ({
                availableDatasets: [
                    ...state.availableDatasets,
                    dataset,
                ],
            })),

        removeDataset: (
            datasetId
        ) =>
            set((state) => ({
                availableDatasets:
                    state.availableDatasets.filter(
                        (d) =>
                            d.id !== datasetId
                    ),

                selectedDatasetId:
                    state.selectedDatasetId ===
                        datasetId
                        ? null
                        : state.selectedDatasetId,
            })),

        selectDataset: (
            selectedDatasetId
        ) =>
            set({
                selectedDatasetId,
            }),

        clearDatasets: () =>
            set({
                availableDatasets: [],
                selectedDatasetId: null,
            }),

        reset: () =>
            set(initialState),
    }));
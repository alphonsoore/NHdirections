function refreshPage() {
			location.reload(); // Reloads the current page
		}

			document.getElementById('seedButton').addEventListener('click', function() {
				this.classList.add('hidden'); // Adds the 'hidden' class
				document.getElementById('seedInput').classList.add('hidden');
				e.preventDefault();
			});

		document.getElementById('Refresher').addEventListener('click', (e) => { e.preventDefault(); location.reload(); });

		function megaMaze(callback) {

			// Function to generate a maze matrix with double-thick walls
			function generateMaze() {
				const seed = document.getElementById('seedInput').value;
				const rng = new Math.seedrandom(seed);
				const rows = 20;
				const cols = 20;

				// Initialize the maze with walls (0s)
				const maze = Array.from({ length: rows }, () => Array(cols).fill(0));

				// Helper function to check if a cell is within bounds
				function isValid(row, col) {
				return row >= 0 && row < rows && col >= 0 && col < cols;
				}

				// Function to generate the maze using a seed-based approach
				const stack = [];

				// Initialize the starting point
				let row = 1;
				let col = 1;
				maze[row][col] = 1;

				stack.push({ row, col });

				while (stack.length > 0) {

					// Generate a random seed-specific number for direction selection
					const seedNumber = Math.floor(rng() * 4);

					// Define directions based on the seed number
					const directions = [
						[-4, 0], // Up
						[4, 0],  // Down
						[0, -4], // Left
						[0, 4],  // Right
					];

						// Shuffle the directions array based on the seed
						for (let i = directions.length - 1; i > 0; i--) {
						const j = Math.floor((seedNumber + i) % (i + 1));
						[directions[i], directions[j]] = [directions[j], directions[i]];
					}

					let pathFound = false;

					for (const [dRow, dCol] of directions) {
						const newRow = row + dRow;
						const newCol = col + dCol;

						if (isValid(newRow, newCol) && maze[newRow][newCol] === 0) {
							maze[newRow][newCol] = 1;
							maze[row + dRow / 2][col + dCol / 2] = 1;
							stack.push({ row: newRow, col: newCol });
							row = newRow;
							col = newCol;
							pathFound = true;
							break;
						}
					}

					if (!pathFound) {
						const popped = stack.pop();
						row = popped.row;
						col = popped.col;
					}
				}

				// Store the generated maze in MazeMatrix
				MazeMatrix = maze;
			}

			// Function to change single 0s between two 1s to 1s in rows
			function changeSingleZerosRows() {
				const rows = MazeMatrix.length;
				const cols = MazeMatrix[0].length;

				// Function to count neighboring 1s in a row
				function countNeighboringOnesInRow(row, col) {
					const neighbors = [
						MazeMatrix[row][col + 1],
						MazeMatrix[row][col - 1],
					];
					return neighbors.reduce((count, val) => count + (val === 1 ? 1 : 0), 0);
				}

				// Change single 0s between two 1s to 1s in rows
				for (let r = 0; r < rows; r++) {
					for (let c = 1; c < cols - 1; c++) {
						if (MazeMatrix[r][c] === 0) {
							if (countNeighboringOnesInRow(r, c) === 2) {
								MazeMatrix[r][c] = 1;
							}
						}
					}
				}
			}

			// Function to change single 0s between two 1s to 1s in columns
			function changeSingleZerosColumns() {
				const rows = MazeMatrix.length;
				const cols = MazeMatrix[0].length;

				// Function to count neighboring 1s in a column
				function countNeighboringOnesInColumn(row, col) {
					const neighbors = [
						MazeMatrix[row + 1][col],
						MazeMatrix[row - 1][col],
					];
					return neighbors.reduce((count, val) => count + (val === 1 ? 1 : 0), 0);
				}

				// Change single 0s between two 1s to 1s in columns
				for (let r = 1; r < rows - 1; r++) {
					for (let c = 0; c < cols; c++) {
						if (MazeMatrix[r][c] === 0) {
							if (countNeighboringOnesInColumn(r, c) === 2) {
								MazeMatrix[r][c] = 1;
							}
						}
					}
				}
			}

			// Function to generate random values from 2 to 9 for 0s
			function generateRandomValues() {
				const rows = MazeMatrix.length;
				const cols = MazeMatrix[0].length;
				const rng = new Math.seedrandom();

				for (let r = 0; r < rows; r++) {
					for (let c = 0; c < cols; c++) {
						if (MazeMatrix[r][c] === 0) {
							MazeMatrix[r][c] = Math.floor(rng() * 8) + 2; // Random value from 2 to 9
						}
					}
				}
			}

			// Function
			function placeSingleNumbersUsingSeed() {
				const rows = MazeMatrix.length;
				const cols = MazeMatrix[0].length;
				const seedInput = document.getElementById('seedInput').value;
				const rng = new Math.seedrandom(seedInput);

				const numbersToPlace = Array.from({ length: 10 }, (_, i) => i + 10); // Numbers 10 to 19
				
				for (const number of numbersToPlace) {
					let placed = false;

					while (!placed) {
						const randomRow = Math.floor(rng() * rows);
						const randomCol = Math.floor(rng() * cols);

						if (MazeMatrix[randomRow][randomCol] !== 1) {
							const adjacentCells = [
								{ row: randomRow - 1, col: randomCol },
								{ row: randomRow + 1, col: randomCol },
								{ row: randomRow, col: randomCol - 1 },
								{ row: randomRow, col: randomCol + 1 },
							];

							const validAdjacentCell = adjacentCells.some(({ row, col }) =>
								row >= 0 && row < rows && col >= 0 && col < cols && MazeMatrix[row][col] === 1
							);

							if (validAdjacentCell) {

								// Determine the relative position to the adjacent "1" cell
								const relativePosition = adjacentCells.findIndex(({ row, col }) =>
									row >= 0 && row < rows && col >= 0 && col < cols && MazeMatrix[row][col] === 1
								);

								// Adjust the number based on relative position
								let newNumber = number;
								if (relativePosition === 0) { // UP
									newNumber += 0.1;
									} else if (relativePosition === 1) { // DOWN
									newNumber += 0.2;
									} else if (relativePosition === 2) { // LEFT
									newNumber += 0.3;
									} else if (relativePosition === 3) { // RIGHT
									newNumber += 0.4;
								}

								MazeMatrix[randomRow][randomCol] = newNumber;
								placed = true;

							}
						}
					}
				}
			}




			// Function to add extra passages between cells
				function addExtraPassages() {
					const rows = MazeMatrix.length;
					const cols = MazeMatrix[0].length;
					const seedInput = document.getElementById('seedInput').value;
					const rng = new Math.seedrandom(seedInput);

					// Function to check if a cell is a valid passage (equal to 1)
						function isValidPassage(row, col) {
							return row >= 0 && row < rows && col >= 0 && col < cols && MazeMatrix[row][col] === 1;
						}

					// Function to find a valid neighboring cell for a given cell
						function findValidNeighbor(row, col) {
							const neighbors = [
								[row - 4, col], // Up
								[row + 4, col], // Down
								[row, col - 4], // Left
								[row, col + 4], // Right
							];

						// Shuffle the neighbors array based on the seed
							for (let i = neighbors.length - 1; i > 0; i--) {
								const j = Math.floor(rng() * (0 * (i + 1)));
								[neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
							}

						// Find the first valid neighbor
							for (const [r, c] of neighbors) {
								if (isValidPassage(r, c)) {
									return [r, c];
								}
							}
							return null; // No valid neighbor found
						}

				// Iterate through the maze and add passages that connect to other passages
					for (let r = 1; r < rows - 1; r += 2) {
						for (let c = 1; c < cols - 1; c += 2) {
							if (MazeMatrix[r][c] === 1) {

								// Find a valid neighboring cell
								const neighbor = findValidNeighbor(r, c);
								if (neighbor) {

								// Create a passage between the current cell and the neighbor
									const [nr, nc] = neighbor;

								// Change values between the two 1s to 1 (0, 2, 3, 4, 5, 6, 7, 8, 9 become 1)
									for (let i = Math.min(r, nr); i <= Math.max(r, nr); i++) {
										for (let j = Math.min(c, nc); j <= Math.max(c, nc); j++) {
											if (MazeMatrix[i][j] <= 9) {
												MazeMatrix[i][j] = 1;
											}
										}
									}
								}
							}
						}
					}
				}

			// Function to generate the maze and process rows and columns
			function generateAndProcessMaze() {
				generateMaze(); // Generate the maze


				changeSingleZerosRows(); // Process rows
				changeSingleZerosColumns(); // Process columns

				addExtraPassages(); // Additional passages detected
				
				generateRandomValues(); // Generate random values for 0s
				placeSingleNumbersUsingSeed();

				console.log(MazeMatrix);
			}

			// File saving function (debug)
			function saveMazeMatrixToFile() {
				const mazeMatrixString = MazeMatrix.map(row => row.join(' ')).join('\n');

				// Create a Blob containing the mazeMatrixString
				const blob = new Blob([mazeMatrixString], { type: 'text/plain' });

				// Create a download link for the Blob
				const a = document.createElement('a');
				a.href = URL.createObjectURL(blob);
				a.download = 'mazeMatrix.txt';

				// Trigger a click event to download the file
				a.click();

				console.log('MazeMatrix saved to mazeMatrix.txt');
			}

			// Clipboard debug
			function copyMazeMatrixToClipboard() {
				const mazeMatrixString = MazeMatrix.map(row => row.join(' ')).join('\n');

				// Create a textarea element to hold the maze matrix text
				const textArea = document.createElement('textarea');
				textArea.value = mazeMatrixString;

				// Append the textarea element to the document
				document.body.appendChild(textArea);

				// Select the text in the textarea
				textArea.select();

				// Copy the selected text to the clipboard
				document.execCommand('copy');

				// Remove the textarea element from the document
				document.body.removeChild(textArea);

				console.log('MazeMatrix copied to clipboard');
			}

			generateMaze();
			generateAndProcessMaze();
			copyMazeMatrixToClipboard();

			if (typeof callback === 'function') {
				callback();
			}
		}

		// Function to toggle fullscreen and re-render the scene
		function toggleFullscreen() {
			const doc = window.document;
			const docEl = doc.documentElement;

			if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
				if (docEl.requestFullscreen) {
					docEl.requestFullscreen();
					} else if (docEl.msRequestFullscreen) {
					docEl.msRequestFullscreen();
					} else if (docEl.mozRequestFullScreen) {
					docEl.mozRequestFullScreen();
					} else if (docEl.webkitRequestFullscreen) {
					docEl.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
					}
				} else {
					if (doc.exitFullscreen) {
					doc.exitFullscreen();
					} else if (doc.msExitFullscreen) {
					doc.msExitFullscreen();
					} else if (doc.mozCancelFullScreen) {
					doc.mozCancelFullScreen();
					} else if (doc.webkitExitFullscreen) {
					doc.webkitExitFullscreen();
					}
				}
			}

		function startGame() {

			// Basic Setup
			const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 1000);
			const renderer = new THREE.WebGLRenderer();
			renderer.setSize(window.outerWidth, window.outerHeight);
			document.body.appendChild(renderer.domElement);

			scene.background = new THREE.Color(0x87CEEB); // Use the color code for sky blue

			// Geometry and Materials
			const groundGeometry = new THREE.PlaneGeometry(2000, 2000, 1, 1);
			const groundMaterial = new THREE.MeshPhongMaterial({
				color: 0x4CAF50,
				shininess: 0, // Set shininess to zero for an unreflective appearance
				specular: 0x000000, // Set specular color to black for an unreflective appearance
				receiveShadow: true,
			});

			const ground = new THREE.Mesh(groundGeometry, groundMaterial)
			ground.receiveShadow = true;

			const loader = new THREE.TextureLoader();

			ground.position.z = -3;

			scene.add(ground);

			// Mountain generation
			function createObtuseIsoscelesTriangle(startX, startY, endX, endY, rotation = 0) {
				const baseWidth = 100; // Adjust the base width as needed

				const triangleSize = 1;
				const minHeight = 10; // Minimum height
				const maxHeight = 30; // Maximum height
				const triangleHeight = minHeight + Math.random() * (maxHeight - minHeight);

				// Calculate a random position within the channel
				const x = startX + (Math.random() * (endX - startX)) + (Math.random() - 0.5) * 100;
				const y = startY + (Math.random() * (endY - startY)) + (Math.random() - 0.5) * 100;

				const geometry = new THREE.Geometry();

				// Define the vertices of the triangle
				const vertices = [
					new THREE.Vector3(0, 0, 0),
					new THREE.Vector3(baseWidth, 0, 0),
					new THREE.Vector3(baseWidth / 2, triangleHeight, 0), // Adjust the height based on the desired obtuse angle
				];

				// Define the faces of the triangle
				geometry.faces.push(new THREE.Face3(0, 1, 2));

				// Set the vertices of the geometry
				geometry.vertices = vertices;

				// Create a mesh for the triangle
				const blueGrayColors = [0x536878, 0x65737e, 0x78849e, 0x6d7f97, 0x596c7d, 0x4c5e6f, 0x4e6a88, 0x5a6c7a, 0x45515e, 0x39434f];
				const material = new THREE.MeshBasicMaterial({ color: blueGrayColors[Math.floor(Math.random() * blueGrayColors.length)], side: THREE.DoubleSide });
				const triangle = new THREE.Mesh(geometry, material);

				// Position the triangle
				triangle.position.set(x, y, -5);

				// Set the rotation to make it vertical in the Z-axis with optional rotation
				triangle.rotation.x = Math.PI / 2;
				triangle.rotation.y = rotation;

				// Add the triangle to the scene
				scene.add(triangle);
			}

			for (let i = 0; i < 100; i++) {
				createObtuseIsoscelesTriangle(-250, 100, 450, 100);
			}

			for (let i = 0; i < 100; i++) {
				createObtuseIsoscelesTriangle(500, 150, 500, -550, Math.PI / 2);
			}

			for (let i = 0; i < 100; i++) {
				createObtuseIsoscelesTriangle(500, -500, -100, -550);
			}

			for (let i = 0; i < 100; i++) {
				createObtuseIsoscelesTriangle(-100, -500, -100, 100, Math.PI / 2);
			}

			// Define an array to hold all building bounding boxes
			const buildingMeshes = [];

			// Define your binary matrix (0s and 1s)
			const binaryMatrix = MazeMatrix;

			// Urban Settings
			const planeSize = 20; // Size of each plane representing roads
			const buildingHeights = [10.0, 17.0, 19.0, 20.0, 21.0, 22.0, 23.0, 25.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0];
			const roadColor = 0x888888; // Gray color
			const buildingColors = [0x222222, 0x333333, 0x444444, 0x555555, 0x666666, 0x777777, 0x888888, 0x999999]; // Colors for buildings

			function getRandomBldg(min, max) {
				return Math.random() * (max - min) + min;
			}

			for (let i = 0; i < binaryMatrix.length; i++) {
				for (let j = 0; j < binaryMatrix[i].length; j++) {
					if (binaryMatrix[i][j] === 1) {
						// Create roads (planes)
						const roadzGeometry = new THREE.PlaneGeometry(planeSize, planeSize);
						const roadzMaterial = new THREE.MeshPhongMaterial({
							color: roadColor,
							shininess: 0,
						});
					roadzMaterial.receiveShadow = true;
					const plane = new THREE.Mesh(roadzGeometry, roadzMaterial);
					plane.receiveShadow = true;
					
					// Position the plane in 3D space based on matrix coordinates
					plane.position.x = j * planeSize;
					plane.position.y = -i * planeSize; // Invert "i" to match matrix coordinates
					plane.position.z = -2.8
						
					scene.add(plane);
						
					} else if (binaryMatrix[i][j] >= 2 && binaryMatrix[i][j] <= 9) {
						// Create buildings (rectangular prisms)
						const randomBldgDim = 0.65 + Math.random() * 0.2; // Building size randomizer
						const geometry = new THREE.BoxGeometry(planeSize * randomBldgDim, planeSize * randomBldgDim, buildingHeights[binaryMatrix[i][j] - 2]);

						const hue = Math.random();
						const saturation = 0.05 + Math.random() * 0.03;
						const lightness = 0.5 + Math.random() * 0.1; // Adjust lightness for muted colors
						const color = new THREE.Color().setHSL(hue, saturation, lightness);

						const material = new THREE.MeshPhongMaterial({ color }); // Use MeshPhongMaterial

						const building = new THREE.Mesh(geometry, material);
						building.castShadow = true; // Enable shadow casting for this object
						building.receiveShadow = true;

						// Position the building in 3D space based on matrix coordinates

						const randomBldgPos = Math.random * 0.01;

						building.position.x = j * planeSize + 1 + getRandomBldg(-0.5, 0.5); // Adjust the range as needed
						building.position.y = -i * planeSize + getRandomBldg(-0.5, 0.5); // Adjust the range as needed
						building.position.z = -3;

						scene.add(building);

						buildingMeshes.push(building);

					// Special buildings
					} else if (binaryMatrix[i][j] >= 10 && binaryMatrix[i][j] <= 20) {
						// Create buildings (rectangular prisms)
						const randomBldgDim = 0.65 + Math.random() * 0.2; // Building size randomizer
						const integerValue = Math.floor(binaryMatrix[i][j] - 10); // Normalize integer value
						const decimalValue = Math.round((binaryMatrix[i][j] - Math.floor(binaryMatrix[i][j])) * 10);

						const decimalValuesArray = [];
						decimalValuesArray.push(decimalValue); 
						console.log("decimalValuesArray: ", decimalValuesArray);

						const geometry = new THREE.BoxGeometry(planeSize * randomBldgDim, planeSize * randomBldgDim, 9);

						const hue = Math.random();
						const saturation = 0.05 + Math.random() * 0.03;
						const lightness = 0.5 + Math.random() * 0.1; // Adjust lightness for muted colors
						const color = new THREE.Color().setHSL(hue, saturation, lightness);
						// const decimalerRotation = (Math.PI / 2) * (decimalValue - 1);

						const materialArray = [];

						// Load textures for different faces
						const textures = [
							'./assets/10.png',
							'./assets/11.png',
							'./assets/12.png',
							'./assets/13.png',
							'./assets/14.png',
							'./assets/15.png',
							'./assets/16.png',
							'./assets/17.png',
							'./assets/18.png',
							'./assets/19.png',
						];

						for (let i = 0; i < 6; i++) {
							if (i === 2) {
    // Use a different texture for the special face
    const texture = new THREE.TextureLoader().load(textures[integerValue]);
    
    // Enable mipmapping and set minFilter for the texture
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;

    materialArray.push(new THREE.MeshBasicMaterial({ map: texture }));
							} else {
								materialArray.push(new THREE.MeshPhongMaterial({ color }));
							}
						}

						const material = new THREE.MeshFaceMaterial(materialArray);

						const building = new THREE.Mesh(geometry, material);
						building.castShadow = true; // Enable shadow casting for this object
						building.receiveShadow = true;

						// Position the building in 3D space based on matrix coordinates
						building.position.x = j * planeSize + 1 + getRandomBldg(-0.5, 0.5); // Adjust the range as needed
						building.position.y = -i * planeSize + getRandomBldg(-0.5, 0.5); // Adjust the range as needed
						building.position.z = 1.2;

						if (decimalValue === 1) {
							building.rotation.z = 0;
						}
						if (decimalValue === 2) {
							building.rotation.z = Math.PI;
						}
						if (decimalValue === 3) {
							building.rotation.z = Math.PI / 2;
						}
						if (decimalValue === 4) {
							building.rotation.z = (3 * Math.PI) / 2;
						}

						scene.add(building);

						buildingMeshes.push(building);
					}
				}
			}

			const loaderGLTF = new THREE.GLTFLoader();

			// Load the GLB model
			loaderGLTF.load('./car.glb', (gltf) => {
						const model = gltf.scene;
						// Set the position of the model
						model.position.set(0, 0, 0);
						model.scale.set(2, 2, 2);
						model.castShadow = true;

						model.traverse((child) => {
								if (child.isMesh) {
									child.castShadow = true; // Enable shadow casting for all mesh parts
									child.receiveShadow = true; // Enable shadow receiving for all mesh parts
								}
							}
						);


					scene.add(model);
					// Add the model to the scene

					// Lights
					const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
					scene.add(ambientLight);
					const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
					directionalLight.position.set(200, 200, 1000);

					scene.add(directionalLight);

					// Set camera rotation for tilting (angle in radians)
					const tiltAngle = Math.PI / 2.5; // 30 degrees in radians
							
					// Camera setup
					camera.position.set(0, -5, 2); // Initial position behind the car
					camera.rotation.x = tiltAngle; // Look down at 30 degrees angle
					model.add(camera); // Attach camera to the car

					// Initialize car movement variables
					
					const carMoveSpeed = 1.0; // Adjust movement speed as needed
					const carRotateSpeed = 0.05; // Adjust rotation speed as needed
					const acceleration = 0.005; // Adjust acceleration rate as needed
					const friction = 2; // Adjust friction rate as needed
					const maxSpeed = 0.5; // Adjust maximum speed as needed
					
					// const carMoveSpeed = 2; // Adjust movement speed as needed
					// const carRotateSpeed = 0.05; // Adjust rotation speed as needed
					let carRotation = Math.PI; // Current rotation angle in radians
					let carPosition = new THREE.Vector3(); // Current position of the car
					carPosition.x = 20
					carPosition.y = -30
					carPosition.z = -1.5
					
					let carSpeed = 0.0;
					let accelerating = false; 

					// Define an array to hold all building bounding boxes
					const buildingBoundingBoxes = [];

					for (const buildingMesh of buildingMeshes) {
						buildingBoundingBoxes.push(new THREE.Box3().setFromObject(buildingMesh));
					}

					const carGeometry = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
					const carRadius = carGeometry.length();

					// Create the carBoundingSphere
					const carBoundingSphere = new THREE.Sphere(carPosition, carRadius / 2);

					function checkBuildingCollisions() {
						const bounceBackDistance = 0.2; // Adjust the bounce-back distance as needed

						// Iterate through all building bounding boxes
						for (const buildingBoundingBox of buildingBoundingBoxes) {
							// Check if the car's bounding sphere intersects with a building bounding box
							if (carBoundingSphere.intersectsBox(buildingBoundingBox)) {
							// Calculate the direction from the car's position to the center of the buildingBoundingBox
								const intersectionPoint = new THREE.Vector3();
								buildingBoundingBox.getCenter(intersectionPoint);
								const direction = intersectionPoint.clone().sub(carBoundingSphere.center).normalize();

								// Prevent car from moving forward
								carPosition.sub(direction.multiplyScalar(carMoveSpeed));

								// Apply the bounce-back effect in the opposite direction
								const backwardDirection = direction.clone().multiplyScalar(-bounceBackDistance);
								carPosition.add(backwardDirection);
							}
						}

						// Ensure that the car's Z-coordinate remains within the specified range
						carPosition.z = 0;

						// Update car position after collision check
						model.position.copy(carPosition);
					}

					// Handle user input
					const keyStates = {
						ArrowLeft: false,
						ArrowRight: false,
						ArrowUp: false,
						ArrowDown: false,
						KeyJ: false,
					};

					// Prevent arrow keys and space bar from scrolling the page
					document.addEventListener('keydown', function (e) {
						if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ') {
							e.preventDefault();
						}
					});

					document.addEventListener('keydown', (event) => {
						if (keyStates.hasOwnProperty(event.code)) {
							keyStates[event.code] = true;
						}
					});

					document.addEventListener('keyup', (event) => {
						if (keyStates.hasOwnProperty(event.code)) {
							keyStates[event.code] = false;
						}
					});

					function moveLeft() {
						carRotation += carRotateSpeed;
					}

					function moveRight() {
						carRotation -= carRotateSpeed;
					}
					
					function moveUp() {
						const newCarPositionY = carPosition.y + carMoveSpeed * Math.cos(carRotation);
						const newCarPositionX = carPosition.x + carMoveSpeed * Math.sin(-carRotation);
						carPosition.y = newCarPositionY;
						carPosition.x = newCarPositionX;
					}
					
					function moveDown() {
						const newCarPositionY = carPosition.y - carMoveSpeed * Math.cos(carRotation);
						const newCarPositionX = carPosition.x - carMoveSpeed * Math.sin(-carRotation);
						carPosition.y = newCarPositionY;
						carPosition.x = newCarPositionX;
					}

					let moveLeftInterval;
					let moveRightInterval;
					let moveUpInterval;
					let moveDownInterval;

					document.getElementById("left-button").addEventListener("pointerdown", function() {
						moveLeftInterval = setInterval(moveLeft, 10);
						e.preventDefault();
					});

					document.getElementById("left-button").addEventListener("pointerup", function() {
						clearInterval(moveLeftInterval);
						e.preventDefault();
					});

					document.getElementById("right-button").addEventListener("pointerdown", function() {
						moveRightInterval = setInterval(moveRight, 10);
						e.preventDefault();
					});

					document.getElementById("right-button").addEventListener("pointerup", function() {
						clearInterval(moveRightInterval);
						e.preventDefault();
					});

					document.getElementById("up-button").addEventListener("pointerdown", function() {
						moveUpInterval = setInterval(moveUp, 10);
						e.preventDefault();
					});

					document.getElementById("up-button").addEventListener("pointerup", function() {
						clearInterval(moveUpInterval);
						e.preventDefault();
					});

					document.getElementById("down-button").addEventListener("pointerdown", function() {
						moveDownInterval = setInterval(moveDown, 10);
						e.preventDefault();
					});

					document.getElementById("down-button").addEventListener("pointerup", function() {
						clearInterval(moveDownInterval);
						e.preventDefault();
					});

					document.getElementById("stop-button").addEventListener("pointerdown", function() {
						stopMoving();
						e.preventDefault();
						carRotateSpeed == 0;
						carMoveSpeed == 0;
					});

					document.getElementById("stop-button").addEventListener("pointerup", function() {
						stopMoving();
						e.preventDefault();
						carRotateSpeed == 0;
						carMoveSpeed == 0;
					});

					function stopMoving() {
						clearInterval(moveLeftInterval);
						clearInterval(moveRightInterval);
						clearInterval(moveUpInterval);
						clearInterval(moveDownInterval);
					}

					// Game loop

					const animate = () => {

						requestAnimationFrame(animate);

						// Update car rotation
						if (keyStates.ArrowLeft) {
							carRotation += carRotateSpeed;
						}

						if (keyStates.ArrowRight) {
							carRotation -= carRotateSpeed;
						}

						if (keyStates.ArrowUp) {
							moveUp();
						}

						if (keyStates.ArrowDown) {
							moveDown();
						}

						// Stuck key behavior (using Space key)
						if (keyStates.KeyJ) {
							const newStuckX = carPosition.x + 10 * carMoveSpeed * Math.sin(-carRotation);
							const newStuckY = carPosition.y + 10 * carMoveSpeed * Math.cos(carRotation);

							carPosition.x = newStuckX;
							carPosition.y = newStuckY;
						}

						// Update car rotation and position
						model.rotation.z = carRotation;
						model.position.copy(carPosition);

						checkBuildingCollisions();

																									// ***DEBUG*** Update overlay with variable values
						//																			overlay.innerHTML = `
						//																				carRotation = ${carRotation}<br>
						//																				carPosition.x = ${carPosition.x}<br>
						//																				carPosition.y = ${carPosition.y}<br>
						//																				carPosition.z = ${carPosition.z}<br>
						//																			`;

						// Render the scene
						renderer.render(scene, camera);
					  
					};

						//																			const overlay = document.getElementById('overlay');

					// Start the game loop
					animate();
				}
			);
		}

		function jesfstart() {
			megaMaze(startGame);
			}
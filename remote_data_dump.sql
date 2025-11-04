SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict z2DTt8PMchKNYXlWpbBO4R6hAEdrqU9ugF3wBM7L1OEeFoRTRHaUMiqGuFoawli

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '47e67f80-1e9c-4078-9504-abc8b2760fa1', '{"action":"user_confirmation_requested","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-10-20 01:10:00.714649+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dfcfddf6-057f-49a2-9a55-590c8fccd7c6', '{"action":"user_confirmation_requested","actor_id":"ff3222b0-76fc-498c-bee8-bf57d0aad2e3","actor_username":"maria.garcia.test@mailinator.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-10-20 01:10:01.320977+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f9bba896-dd3c-4d79-b0b8-fbb5fea944ce', '{"action":"user_confirmation_requested","actor_id":"c3683f44-c77d-4a9e-9b68-bfbdd494821c","actor_username":"carlos.rodriguez.test@mailinator.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-10-20 01:10:02.082274+00', ''),
	('00000000-0000-0000-0000-000000000000', '6a1faaed-93c3-4bbe-9c41-d7f9adf9ed32', '{"action":"user_confirmation_requested","actor_id":"14a0bf20-93fe-4f0d-a58e-dcfccd280fdf","actor_username":"ana.martinez.test@mailinator.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-10-20 01:10:02.625025+00', ''),
	('00000000-0000-0000-0000-000000000000', '2a90b510-8a7c-490a-bd68-f9d97b2eefb9', '{"action":"user_confirmation_requested","actor_id":"9053dd04-a7db-433a-874b-65330056b6fc","actor_username":"luis.hernandez.test@mailinator.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-10-20 01:10:03.163497+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f3f978b7-6212-4de1-85bb-d9c332d75902', '{"action":"user_confirmation_requested","actor_id":"75e62d04-33f2-44aa-a615-f961866f7c05","actor_username":"sofia.lopez.test@mailinator.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-10-20 01:10:03.70343+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a7bd842a-c0fc-4ae0-9739-fece9582ad0d', '{"action":"user_confirmation_requested","actor_id":"a87b6ae9-13d0-42e2-9aa3-bd4bd6d4d3b9","actor_username":"diego.gonzalez.test@mailinator.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-10-20 01:10:04.226287+00', ''),
	('00000000-0000-0000-0000-000000000000', '025ff542-ee83-40ea-a309-6643cba7632c', '{"action":"user_confirmation_requested","actor_id":"0fb7f2c1-30cf-4ae1-b9b0-918b2024398b","actor_username":"valentina.ramirez.test@mailinator.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-10-20 01:10:04.757148+00', ''),
	('00000000-0000-0000-0000-000000000000', '6d0cab22-ee99-446f-82b5-bdc7884a07eb', '{"action":"user_confirmation_requested","actor_id":"b8b57664-67f4-472a-ad66-7f48064ba0c0","actor_username":"santiago.torres.test@mailinator.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-10-20 01:10:05.324953+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fe1b2358-592e-4a20-96cf-c78a590c7ad6', '{"action":"user_confirmation_requested","actor_id":"98d96f0d-3e3d-4458-930f-78a9978b6556","actor_username":"isabella.jimenez.test@mailinator.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-10-20 01:10:05.891328+00', ''),
	('00000000-0000-0000-0000-000000000000', '64aec37a-78b0-4d49-b0b8-815d837f1b3f', '{"action":"login","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:17:18.474182+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a10e8934-23fc-410d-b3c7-d6e856096e87', '{"action":"login","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:18:33.549262+00', ''),
	('00000000-0000-0000-0000-000000000000', '0faf7884-4ab7-4556-bc08-3fc2342907e3', '{"action":"logout","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:18:34.118757+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd91aec7f-897d-4fb4-962d-67ff8dec5a00', '{"action":"login","actor_id":"ff3222b0-76fc-498c-bee8-bf57d0aad2e3","actor_username":"maria.garcia.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:18:34.413066+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b432884c-65d2-4719-9fcd-9648ce8f9118', '{"action":"logout","actor_id":"ff3222b0-76fc-498c-bee8-bf57d0aad2e3","actor_username":"maria.garcia.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:18:34.847042+00', ''),
	('00000000-0000-0000-0000-000000000000', '460ca825-f7f9-45cf-b30e-22c2c131d0fa', '{"action":"login","actor_id":"c3683f44-c77d-4a9e-9b68-bfbdd494821c","actor_username":"carlos.rodriguez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:18:35.056071+00', ''),
	('00000000-0000-0000-0000-000000000000', '9d428fe2-3eaf-40c3-9df7-74596e505fab', '{"action":"logout","actor_id":"c3683f44-c77d-4a9e-9b68-bfbdd494821c","actor_username":"carlos.rodriguez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:18:35.350322+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ea8922f3-ab81-406b-94cc-8847a812e82b', '{"action":"login","actor_id":"ff3222b0-76fc-498c-bee8-bf57d0aad2e3","actor_username":"maria.garcia.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:18:44.97297+00', ''),
	('00000000-0000-0000-0000-000000000000', '152278f0-075a-40bd-aaae-53744595a4f8', '{"action":"login","actor_id":"98d96f0d-3e3d-4458-930f-78a9978b6556","actor_username":"isabella.jimenez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:27:54.173579+00', ''),
	('00000000-0000-0000-0000-000000000000', '140442ee-6840-48a1-b366-6e65c1908a9c', '{"action":"logout","actor_id":"98d96f0d-3e3d-4458-930f-78a9978b6556","actor_username":"isabella.jimenez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:27:54.348707+00', ''),
	('00000000-0000-0000-0000-000000000000', '1588f4db-5dd4-4e38-ba9d-a63387e388b5', '{"action":"login","actor_id":"b8b57664-67f4-472a-ad66-7f48064ba0c0","actor_username":"santiago.torres.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:27:54.79317+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fc7d67a7-b2c1-440b-8917-29eb82d86ac9', '{"action":"logout","actor_id":"b8b57664-67f4-472a-ad66-7f48064ba0c0","actor_username":"santiago.torres.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:27:54.945372+00', ''),
	('00000000-0000-0000-0000-000000000000', '0b64576d-2aad-432e-9958-6d8a66ec64d3', '{"action":"login","actor_id":"0fb7f2c1-30cf-4ae1-b9b0-918b2024398b","actor_username":"valentina.ramirez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:27:55.197672+00', ''),
	('00000000-0000-0000-0000-000000000000', '485c5321-5609-4f3a-a07b-6e75aba8cd08', '{"action":"logout","actor_id":"0fb7f2c1-30cf-4ae1-b9b0-918b2024398b","actor_username":"valentina.ramirez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:27:55.342542+00', ''),
	('00000000-0000-0000-0000-000000000000', '529e0793-9eb7-46d7-a3c9-24afeb72cbe2', '{"action":"login","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:28:25.496891+00', ''),
	('00000000-0000-0000-0000-000000000000', '39619838-18d2-49a2-a5f4-0846355c67ed', '{"action":"logout","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:28:25.655121+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e7d211b9-6491-47e0-ab8d-d4a05bd84ef5', '{"action":"login","actor_id":"ff3222b0-76fc-498c-bee8-bf57d0aad2e3","actor_username":"maria.garcia.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:28:25.99007+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c909d9a0-fcf7-4c11-82db-a0e26cac75ac', '{"action":"logout","actor_id":"ff3222b0-76fc-498c-bee8-bf57d0aad2e3","actor_username":"maria.garcia.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:28:26.155635+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e16bca18-6e31-44e8-9746-96290a4a5598', '{"action":"login","actor_id":"c3683f44-c77d-4a9e-9b68-bfbdd494821c","actor_username":"carlos.rodriguez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:28:26.378879+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd15a4053-a7a1-46ea-9c2f-5df3e74e7d3b', '{"action":"logout","actor_id":"c3683f44-c77d-4a9e-9b68-bfbdd494821c","actor_username":"carlos.rodriguez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:28:26.535539+00', ''),
	('00000000-0000-0000-0000-000000000000', '68ec6584-4d42-4ab2-b1e0-4b211913b61d', '{"action":"login","actor_id":"14a0bf20-93fe-4f0d-a58e-dcfccd280fdf","actor_username":"ana.martinez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:28:26.746238+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ee19928a-dc3a-4c64-a220-de13ef097e5a', '{"action":"logout","actor_id":"14a0bf20-93fe-4f0d-a58e-dcfccd280fdf","actor_username":"ana.martinez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:28:26.89822+00', ''),
	('00000000-0000-0000-0000-000000000000', '795a2fca-69c7-4eb6-83b0-928d2976b344', '{"action":"login","actor_id":"9053dd04-a7db-433a-874b-65330056b6fc","actor_username":"luis.hernandez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:28:27.124571+00', ''),
	('00000000-0000-0000-0000-000000000000', '54bf94f2-f05b-4eb7-a564-5643e1c7b653', '{"action":"logout","actor_id":"9053dd04-a7db-433a-874b-65330056b6fc","actor_username":"luis.hernandez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:28:27.287674+00', ''),
	('00000000-0000-0000-0000-000000000000', '9e3f9d31-49fc-4351-981f-5dac57d16dba', '{"action":"login","actor_id":"75e62d04-33f2-44aa-a615-f961866f7c05","actor_username":"sofia.lopez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:28:27.504026+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f35c7024-f581-488c-a698-b2c4bb1250c8', '{"action":"logout","actor_id":"75e62d04-33f2-44aa-a615-f961866f7c05","actor_username":"sofia.lopez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:28:27.658956+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e6230ac5-10e0-4842-901b-0b7c44a8058f', '{"action":"login","actor_id":"a87b6ae9-13d0-42e2-9aa3-bd4bd6d4d3b9","actor_username":"diego.gonzalez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:28:27.897242+00', ''),
	('00000000-0000-0000-0000-000000000000', '901a2bd1-4a7f-4fe9-a122-7aa2a8549f61', '{"action":"logout","actor_id":"a87b6ae9-13d0-42e2-9aa3-bd4bd6d4d3b9","actor_username":"diego.gonzalez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:28:28.051381+00', ''),
	('00000000-0000-0000-0000-000000000000', '94fcc3fa-7b0a-4640-b4b3-42535b42f8a3', '{"action":"login","actor_id":"0fb7f2c1-30cf-4ae1-b9b0-918b2024398b","actor_username":"valentina.ramirez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:28:28.273324+00', ''),
	('00000000-0000-0000-0000-000000000000', '7b727e62-5bf3-464f-a85e-53e31dcf7ab7', '{"action":"logout","actor_id":"0fb7f2c1-30cf-4ae1-b9b0-918b2024398b","actor_username":"valentina.ramirez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:28:28.490013+00', ''),
	('00000000-0000-0000-0000-000000000000', '8143ce8d-e449-4519-b8b7-765bd0231c56', '{"action":"login","actor_id":"b8b57664-67f4-472a-ad66-7f48064ba0c0","actor_username":"santiago.torres.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:28:28.72499+00', ''),
	('00000000-0000-0000-0000-000000000000', 'be7e7601-595b-4008-a888-b670cb82f44a', '{"action":"logout","actor_id":"b8b57664-67f4-472a-ad66-7f48064ba0c0","actor_username":"santiago.torres.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:28:28.993391+00', ''),
	('00000000-0000-0000-0000-000000000000', '27a753b2-6bb5-444a-989f-152edf236c83', '{"action":"login","actor_id":"98d96f0d-3e3d-4458-930f-78a9978b6556","actor_username":"isabella.jimenez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:28:29.202668+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c6c48135-f771-470b-b913-42777db7a376', '{"action":"logout","actor_id":"98d96f0d-3e3d-4458-930f-78a9978b6556","actor_username":"isabella.jimenez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:28:29.367868+00', ''),
	('00000000-0000-0000-0000-000000000000', '9d4d79d2-2add-4600-a100-d2d5a9936879', '{"action":"login","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:28:36.953412+00', ''),
	('00000000-0000-0000-0000-000000000000', '1cf693e1-6acf-4836-b95f-b25537dd730c', '{"action":"login","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:29:04.630866+00', ''),
	('00000000-0000-0000-0000-000000000000', '73534464-40ea-4a36-ab6c-0c09786324b2', '{"action":"login","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:29:35.940359+00', ''),
	('00000000-0000-0000-0000-000000000000', '68e73b8f-4c0d-4eea-b78d-17f21f1b9ce7', '{"action":"login","actor_id":"a87b6ae9-13d0-42e2-9aa3-bd4bd6d4d3b9","actor_username":"diego.gonzalez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:30:49.30737+00', ''),
	('00000000-0000-0000-0000-000000000000', '8cac848d-a97d-422c-96bc-687672527a1c', '{"action":"login","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:31:52.163699+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f36d0a39-9eb0-4a61-8b4a-4bcc615af10f', '{"action":"logout","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:31:52.353976+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ab9c43e2-e3c5-46f9-a728-08b6d9cc51df', '{"action":"login","actor_id":"ff3222b0-76fc-498c-bee8-bf57d0aad2e3","actor_username":"maria.garcia.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:31:52.721831+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b972ae73-5cae-4397-be90-cc3bf09b3f27', '{"action":"logout","actor_id":"ff3222b0-76fc-498c-bee8-bf57d0aad2e3","actor_username":"maria.garcia.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:31:52.87541+00', ''),
	('00000000-0000-0000-0000-000000000000', '9a9d6272-3276-42d9-80d5-919d9b049070', '{"action":"login","actor_id":"c3683f44-c77d-4a9e-9b68-bfbdd494821c","actor_username":"carlos.rodriguez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:31:53.090904+00', ''),
	('00000000-0000-0000-0000-000000000000', '13b06f7c-e356-4d67-a4b3-e65d9014266e', '{"action":"logout","actor_id":"c3683f44-c77d-4a9e-9b68-bfbdd494821c","actor_username":"carlos.rodriguez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:31:53.24308+00', ''),
	('00000000-0000-0000-0000-000000000000', '10a42d82-b8ca-4961-80ea-b951d9a15526', '{"action":"login","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:32:32.386168+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e66c29c0-624d-409d-a51a-2a731e29628e', '{"action":"logout","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:32:32.564088+00', ''),
	('00000000-0000-0000-0000-000000000000', '4c537281-e4ef-4f9d-82a9-677964554945', '{"action":"login","actor_id":"ff3222b0-76fc-498c-bee8-bf57d0aad2e3","actor_username":"maria.garcia.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:32:32.875731+00', ''),
	('00000000-0000-0000-0000-000000000000', '5b5a13e6-a49a-4a7c-8c0c-de357efcbd5e', '{"action":"logout","actor_id":"ff3222b0-76fc-498c-bee8-bf57d0aad2e3","actor_username":"maria.garcia.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:32:33.039568+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c66e68d1-935c-42c2-953c-ad4cb72c136c', '{"action":"login","actor_id":"c3683f44-c77d-4a9e-9b68-bfbdd494821c","actor_username":"carlos.rodriguez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:32:33.278406+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c5bf63fd-ccca-49b4-abec-bcca94744716', '{"action":"logout","actor_id":"c3683f44-c77d-4a9e-9b68-bfbdd494821c","actor_username":"carlos.rodriguez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:32:33.51992+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c43e9f34-2b02-4cdf-8883-a453b6e2ce44', '{"action":"login","actor_id":"14a0bf20-93fe-4f0d-a58e-dcfccd280fdf","actor_username":"ana.martinez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:32:33.743136+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e6a7c144-1913-4d8e-99e8-7e0c92cdf313', '{"action":"logout","actor_id":"14a0bf20-93fe-4f0d-a58e-dcfccd280fdf","actor_username":"ana.martinez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:32:33.90122+00', ''),
	('00000000-0000-0000-0000-000000000000', '306d291e-8ec1-4ff3-ba9e-4f653bec02fa', '{"action":"login","actor_id":"9053dd04-a7db-433a-874b-65330056b6fc","actor_username":"luis.hernandez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:32:34.129684+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cae238a4-e07f-4f9b-b77f-fdf8576acdd4', '{"action":"logout","actor_id":"9053dd04-a7db-433a-874b-65330056b6fc","actor_username":"luis.hernandez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:32:34.274178+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a54d9d43-cc00-4f2e-8147-8bddf81d6c96', '{"action":"login","actor_id":"75e62d04-33f2-44aa-a615-f961866f7c05","actor_username":"sofia.lopez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:32:34.503793+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd03ef7c6-8222-4ab5-b9bc-3aef28cde9a5', '{"action":"logout","actor_id":"75e62d04-33f2-44aa-a615-f961866f7c05","actor_username":"sofia.lopez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:32:34.661352+00', ''),
	('00000000-0000-0000-0000-000000000000', '9f58dcec-3189-4a59-98db-1279cbebef7a', '{"action":"login","actor_id":"a87b6ae9-13d0-42e2-9aa3-bd4bd6d4d3b9","actor_username":"diego.gonzalez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:32:34.897901+00', ''),
	('00000000-0000-0000-0000-000000000000', '3f0a2b12-49d7-47da-8af6-e19c6d1af5d8', '{"action":"logout","actor_id":"a87b6ae9-13d0-42e2-9aa3-bd4bd6d4d3b9","actor_username":"diego.gonzalez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:32:35.05375+00', ''),
	('00000000-0000-0000-0000-000000000000', '3e6b5abd-1548-4592-8a3e-25464f99cfaa', '{"action":"login","actor_id":"0fb7f2c1-30cf-4ae1-b9b0-918b2024398b","actor_username":"valentina.ramirez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:32:35.273326+00', ''),
	('00000000-0000-0000-0000-000000000000', '54a8463e-51b5-4dcb-aa42-2e72fa31aff4', '{"action":"logout","actor_id":"0fb7f2c1-30cf-4ae1-b9b0-918b2024398b","actor_username":"valentina.ramirez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:32:35.420448+00', ''),
	('00000000-0000-0000-0000-000000000000', '5471dab9-c372-47b0-814c-1437dc4d5b12', '{"action":"login","actor_id":"b8b57664-67f4-472a-ad66-7f48064ba0c0","actor_username":"santiago.torres.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:32:35.643987+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f4c80f16-e291-44c1-b56a-1eb3056b3a1b', '{"action":"logout","actor_id":"b8b57664-67f4-472a-ad66-7f48064ba0c0","actor_username":"santiago.torres.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:32:35.80621+00', ''),
	('00000000-0000-0000-0000-000000000000', '6512874c-243c-451b-b46a-6c61edf64a5c', '{"action":"login","actor_id":"98d96f0d-3e3d-4458-930f-78a9978b6556","actor_username":"isabella.jimenez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:32:36.013151+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a83babe0-9e3e-4fd3-909f-d39a7f2c808d', '{"action":"logout","actor_id":"98d96f0d-3e3d-4458-930f-78a9978b6556","actor_username":"isabella.jimenez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 01:32:36.17044+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b3c652f3-07e0-4bbd-86df-52f9d984eda5', '{"action":"login","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:47:08.999261+00', ''),
	('00000000-0000-0000-0000-000000000000', '5afe98ff-baa0-4323-9fa2-977f479d5d65', '{"action":"login","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 01:49:42.40974+00', ''),
	('00000000-0000-0000-0000-000000000000', '52eac78a-7121-46eb-aad1-e09a0e80f12c', '{"action":"login","actor_id":"75e62d04-33f2-44aa-a615-f961866f7c05","actor_username":"sofia.lopez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 02:03:24.742258+00', ''),
	('00000000-0000-0000-0000-000000000000', '2130f1f3-3dcc-44d3-83cc-8d96fd0ab765', '{"action":"login","actor_id":"75e62d04-33f2-44aa-a615-f961866f7c05","actor_username":"sofia.lopez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 02:04:00.767637+00', ''),
	('00000000-0000-0000-0000-000000000000', '63dba950-4682-4700-8997-51b2f6e3b831', '{"action":"login","actor_id":"75e62d04-33f2-44aa-a615-f961866f7c05","actor_username":"sofia.lopez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 02:07:08.821663+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cddb6b9c-4761-40ac-9061-518eb186de97', '{"action":"login","actor_id":"75e62d04-33f2-44aa-a615-f961866f7c05","actor_username":"sofia.lopez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 02:09:44.54677+00', ''),
	('00000000-0000-0000-0000-000000000000', '1b3148fe-e76f-47dc-b18c-411de5536ab5', '{"action":"login","actor_id":"75e62d04-33f2-44aa-a615-f961866f7c05","actor_username":"sofia.lopez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 02:18:24.782629+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a38156fa-8580-400a-94cf-b7a92fcc5299', '{"action":"login","actor_id":"75e62d04-33f2-44aa-a615-f961866f7c05","actor_username":"sofia.lopez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 02:18:48.160247+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c387263f-7226-43dd-b43f-a1f31c8a7205', '{"action":"login","actor_id":"75e62d04-33f2-44aa-a615-f961866f7c05","actor_username":"sofia.lopez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 02:23:51.134063+00', ''),
	('00000000-0000-0000-0000-000000000000', '73bf4bd8-9a67-4f55-9d56-a18bf353b30d', '{"action":"login","actor_id":"75e62d04-33f2-44aa-a615-f961866f7c05","actor_username":"sofia.lopez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 02:24:59.415074+00', ''),
	('00000000-0000-0000-0000-000000000000', '29db1dc5-4f43-47aa-8225-13eccb6a19ad', '{"action":"logout","actor_id":"75e62d04-33f2-44aa-a615-f961866f7c05","actor_username":"sofia.lopez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 02:25:01.85111+00', ''),
	('00000000-0000-0000-0000-000000000000', '55c24e22-73a8-4385-a6cd-57f1a41f5823', '{"action":"login","actor_id":"75e62d04-33f2-44aa-a615-f961866f7c05","actor_username":"sofia.lopez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 02:25:25.904594+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da09c82d-0f93-415b-bd9d-7093b0de7d76', '{"action":"logout","actor_id":"75e62d04-33f2-44aa-a615-f961866f7c05","actor_username":"sofia.lopez.test@mailinator.com","actor_via_sso":false,"log_type":"account"}', '2025-10-20 02:25:28.423178+00', ''),
	('00000000-0000-0000-0000-000000000000', '15dd2c49-0942-4b5a-aac5-7c52337b18bf', '{"action":"login","actor_id":"75e62d04-33f2-44aa-a615-f961866f7c05","actor_username":"sofia.lopez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 02:25:46.16588+00', ''),
	('00000000-0000-0000-0000-000000000000', '8a893d6d-895c-41bb-86ec-acd679814217', '{"action":"token_refreshed","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"token"}', '2025-10-20 11:09:51.901056+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e51504b2-fa7e-436a-9bc1-1e863302d6f2', '{"action":"token_revoked","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"token"}', '2025-10-20 11:09:51.929716+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e2d84a3c-6069-465f-b4b2-6c18a4df4f58', '{"action":"token_refreshed","actor_id":"75e62d04-33f2-44aa-a615-f961866f7c05","actor_username":"sofia.lopez.test@mailinator.com","actor_via_sso":false,"log_type":"token"}', '2025-10-20 14:20:21.115428+00', ''),
	('00000000-0000-0000-0000-000000000000', '55de3205-ca76-48fe-a05d-385e07dbcc77', '{"action":"token_revoked","actor_id":"75e62d04-33f2-44aa-a615-f961866f7c05","actor_username":"sofia.lopez.test@mailinator.com","actor_via_sso":false,"log_type":"token"}', '2025-10-20 14:20:21.13343+00', ''),
	('00000000-0000-0000-0000-000000000000', '8841b6f0-0756-42d8-acb9-9b303819d102', '{"action":"token_refreshed","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"token"}', '2025-10-20 14:31:25.358167+00', ''),
	('00000000-0000-0000-0000-000000000000', '67d24892-6e51-47f9-a270-396a241bbc7c', '{"action":"token_revoked","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"token"}', '2025-10-20 14:31:25.36323+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c06aa7c5-fe20-4eef-be3e-dfa564a26274', '{"action":"token_refreshed","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"token"}', '2025-10-20 16:00:23.745166+00', ''),
	('00000000-0000-0000-0000-000000000000', '34839cd0-4acc-4006-b8cc-c9cfb22eb0ae', '{"action":"token_revoked","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"token"}', '2025-10-20 16:00:23.769304+00', ''),
	('00000000-0000-0000-0000-000000000000', '84f4360e-666d-456a-9034-b99667fce1cc', '{"action":"login","actor_id":"b31f8aff-1f3a-4cc4-bc54-234d4fa62c89","actor_username":"juan.perez.test@mailinator.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-10-20 16:23:49.265689+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '14a0bf20-93fe-4f0d-a58e-dcfccd280fdf', 'authenticated', 'authenticated', 'ana.martinez.test@mailinator.com', '$2a$10$T8bRiG8zyTQCyyZz2Vgs2.F0NBTdGAaBuwXSHhgALJZpHJuivbPBu', '2025-10-20 01:16:55.107636+00', NULL, '03a4c4cb0a50e3263d40977cd140da38e32e54c371a80be3a87b01d0', '2025-10-20 01:10:02.625646+00', '', NULL, '', '', NULL, '2025-10-20 01:32:33.743825+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "14a0bf20-93fe-4f0d-a58e-dcfccd280fdf", "name": "Ana Martínez", "email": "ana.martinez.test@mailinator.com", "phone": "+57 300 456 7890", "email_verified": false, "phone_verified": false}', NULL, '2025-10-20 01:10:02.618327+00', '2025-10-20 01:32:33.745416+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'ff3222b0-76fc-498c-bee8-bf57d0aad2e3', 'authenticated', 'authenticated', 'maria.garcia.test@mailinator.com', '$2a$10$Yhfl2FhJleS0peCkCVKet.E72f3r5Jh2Gv56CJf0ahNrm5cus2V06', '2025-10-20 01:16:55.107636+00', NULL, '98b0bd99626b1edab4593636f7e7af5023dbf32d601f5094b36b8aa3', '2025-10-20 01:10:01.321601+00', '', NULL, '', '', NULL, '2025-10-20 01:32:32.876507+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "ff3222b0-76fc-498c-bee8-bf57d0aad2e3", "name": "María García", "email": "maria.garcia.test@mailinator.com", "phone": "+57 300 234 5678", "email_verified": false, "phone_verified": false}', NULL, '2025-10-20 01:10:01.316975+00', '2025-10-20 01:32:32.87815+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'c3683f44-c77d-4a9e-9b68-bfbdd494821c', 'authenticated', 'authenticated', 'carlos.rodriguez.test@mailinator.com', '$2a$10$/aSpohyC6V3HhLMZ2xyi9u55751rmAQ200zXhB1YzNXJh3lv89Fn2', '2025-10-20 01:16:55.107636+00', NULL, 'bfdc1f87202bfd2b45f2529d981f7d8ca4dac410ddba7ecb27973f58', '2025-10-20 01:10:02.082795+00', '', NULL, '', '', NULL, '2025-10-20 01:32:33.27915+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "c3683f44-c77d-4a9e-9b68-bfbdd494821c", "name": "Carlos Rodríguez", "email": "carlos.rodriguez.test@mailinator.com", "phone": "+57 300 345 6789", "email_verified": false, "phone_verified": false}', NULL, '2025-10-20 01:10:02.077483+00', '2025-10-20 01:32:33.281077+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', 'authenticated', 'authenticated', 'juan.perez.test@mailinator.com', '$2a$10$ajMlPh5kwsv1m1ZzUssX0.WXU0PKGNZh40alQJoofzzvMe7fCSR9O', '2025-10-20 01:16:55.107636+00', NULL, '5f2b09a512ee2eaea9d60f7221ce152ca63f2d763a9af1030eef9a99', '2025-10-20 01:10:00.715427+00', '', NULL, '', '', NULL, '2025-10-20 16:23:49.281482+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "b31f8aff-1f3a-4cc4-bc54-234d4fa62c89", "name": "Juan Pérez", "email": "juan.perez.test@mailinator.com", "phone": "+57 300 123 4567", "email_verified": false, "phone_verified": false}', NULL, '2025-10-20 01:10:00.710153+00', '2025-10-20 16:23:49.307359+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'b8b57664-67f4-472a-ad66-7f48064ba0c0', 'authenticated', 'authenticated', 'santiago.torres.test@mailinator.com', '$2a$10$EbBQymeWYMgJvhj2G5vlS.Y5vsvBe72ve6wRVzI8u/E6hJUSF.54q', '2025-10-20 01:16:55.107636+00', NULL, 'fb2ab4949c16e7b46c7518fbcf223f361cea7eef0598e5c6c06d9519', '2025-10-20 01:10:05.325528+00', '', NULL, '', '', NULL, '2025-10-20 01:32:35.645894+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "b8b57664-67f4-472a-ad66-7f48064ba0c0", "name": "Santiago Torres", "email": "santiago.torres.test@mailinator.com", "phone": "+57 300 901 2345", "email_verified": false, "phone_verified": false}', NULL, '2025-10-20 01:10:05.321065+00', '2025-10-20 01:32:35.647503+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '98d96f0d-3e3d-4458-930f-78a9978b6556', 'authenticated', 'authenticated', 'isabella.jimenez.test@mailinator.com', '$2a$10$Au250Fcy6BmLxa/KQV0B8.9CR7LxXU1QU1csVKnica4LNsp4aGrvG', '2025-10-20 01:16:55.107636+00', NULL, '040478fbbe1d893986eebc9f94155cf8b64af66661446e568ea4b262', '2025-10-20 01:10:05.891948+00', '', NULL, '', '', NULL, '2025-10-20 01:32:36.014371+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "98d96f0d-3e3d-4458-930f-78a9978b6556", "name": "Isabella Jiménez", "email": "isabella.jimenez.test@mailinator.com", "phone": "+57 300 012 3456", "email_verified": false, "phone_verified": false}', NULL, '2025-10-20 01:10:05.887199+00', '2025-10-20 01:32:36.015896+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '75e62d04-33f2-44aa-a615-f961866f7c05', 'authenticated', 'authenticated', 'sofia.lopez.test@mailinator.com', '$2a$10$45Gk2hzMRFVwj9QVo0.7rOVTwPfQwPzXbAYvT0ZbqgyNQUg5xPdk6', '2025-10-20 01:16:55.107636+00', NULL, '258534e723491e5dde06d28618606ac6f4662e07e293e99142a01003', '2025-10-20 01:10:03.704021+00', '', NULL, '', '', NULL, '2025-10-20 02:25:46.166674+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "75e62d04-33f2-44aa-a615-f961866f7c05", "name": "Sofía López", "email": "sofia.lopez.test@mailinator.com", "phone": "+57 300 678 9012", "email_verified": false, "phone_verified": false}', NULL, '2025-10-20 01:10:03.699064+00', '2025-10-20 14:20:21.162361+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '9053dd04-a7db-433a-874b-65330056b6fc', 'authenticated', 'authenticated', 'luis.hernandez.test@mailinator.com', '$2a$10$YV8BtFQ2dcCFOiYFcq8Ht.B/q7u7nobDBfrSk2c1eR302.vsnt5dm', '2025-10-20 01:16:55.107636+00', NULL, 'd412218e21217507723bfe39da7985a564028a2bdce9eae893a47e06', '2025-10-20 01:10:03.163987+00', '', NULL, '', '', NULL, '2025-10-20 01:32:34.131234+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "9053dd04-a7db-433a-874b-65330056b6fc", "name": "Luis Hernández", "email": "luis.hernandez.test@mailinator.com", "phone": "+57 300 567 8901", "email_verified": false, "phone_verified": false}', NULL, '2025-10-20 01:10:03.159438+00', '2025-10-20 01:32:34.134084+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a87b6ae9-13d0-42e2-9aa3-bd4bd6d4d3b9', 'authenticated', 'authenticated', 'diego.gonzalez.test@mailinator.com', '$2a$10$TjIJk57P/2Jecro/weWeHOliO7vsBcbu1Fw04.U0WOFLQiccB/X3m', '2025-10-20 01:16:55.107636+00', NULL, '66be4cf923430013ae42d052861fa5a25efbee125a1231ed2907c0a2', '2025-10-20 01:10:04.226768+00', '', NULL, '', '', NULL, '2025-10-20 01:32:34.899154+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "a87b6ae9-13d0-42e2-9aa3-bd4bd6d4d3b9", "name": "Diego González", "email": "diego.gonzalez.test@mailinator.com", "phone": "+57 300 789 0123", "email_verified": false, "phone_verified": false}', NULL, '2025-10-20 01:10:04.221487+00', '2025-10-20 01:32:34.901578+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '0fb7f2c1-30cf-4ae1-b9b0-918b2024398b', 'authenticated', 'authenticated', 'valentina.ramirez.test@mailinator.com', '$2a$10$ygfKs3QKCFlgNztA8PLLcuEKNe7elAN8mGj9Cs4dud6ycwAVFA9TO', '2025-10-20 01:16:55.107636+00', NULL, '6c53e713cadf61b7c8b1f636beb4ed3f3f86775f25faa2d8becb4e4b', '2025-10-20 01:10:04.758412+00', '', NULL, '', '', NULL, '2025-10-20 01:32:35.274079+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "0fb7f2c1-30cf-4ae1-b9b0-918b2024398b", "name": "Valentina Ramírez", "email": "valentina.ramirez.test@mailinator.com", "phone": "+57 300 890 1234", "email_verified": false, "phone_verified": false}', NULL, '2025-10-20 01:10:04.753287+00', '2025-10-20 01:32:35.27563+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', '{"sub": "b31f8aff-1f3a-4cc4-bc54-234d4fa62c89", "name": "Juan Pérez", "email": "juan.perez.test@mailinator.com", "phone": "+57 300 123 4567", "email_verified": false, "phone_verified": false}', 'email', '2025-10-20 01:10:00.712507+00', '2025-10-20 01:10:00.712555+00', '2025-10-20 01:10:00.712555+00', '12c32773-1428-4e87-bebb-ccb458bfc421'),
	('ff3222b0-76fc-498c-bee8-bf57d0aad2e3', 'ff3222b0-76fc-498c-bee8-bf57d0aad2e3', '{"sub": "ff3222b0-76fc-498c-bee8-bf57d0aad2e3", "name": "María García", "email": "maria.garcia.test@mailinator.com", "phone": "+57 300 234 5678", "email_verified": false, "phone_verified": false}', 'email', '2025-10-20 01:10:01.31903+00', '2025-10-20 01:10:01.319079+00', '2025-10-20 01:10:01.319079+00', '7e3740b5-8b1b-468d-8910-ae8f2ef8dedf'),
	('c3683f44-c77d-4a9e-9b68-bfbdd494821c', 'c3683f44-c77d-4a9e-9b68-bfbdd494821c', '{"sub": "c3683f44-c77d-4a9e-9b68-bfbdd494821c", "name": "Carlos Rodríguez", "email": "carlos.rodriguez.test@mailinator.com", "phone": "+57 300 345 6789", "email_verified": false, "phone_verified": false}', 'email', '2025-10-20 01:10:02.079691+00', '2025-10-20 01:10:02.079739+00', '2025-10-20 01:10:02.079739+00', '0b5bacca-41de-45c5-9bd5-a6fcd4ccf449'),
	('14a0bf20-93fe-4f0d-a58e-dcfccd280fdf', '14a0bf20-93fe-4f0d-a58e-dcfccd280fdf', '{"sub": "14a0bf20-93fe-4f0d-a58e-dcfccd280fdf", "name": "Ana Martínez", "email": "ana.martinez.test@mailinator.com", "phone": "+57 300 456 7890", "email_verified": false, "phone_verified": false}', 'email', '2025-10-20 01:10:02.621104+00', '2025-10-20 01:10:02.621148+00', '2025-10-20 01:10:02.621148+00', 'a9b26e91-11f6-442d-b4e9-eba9af59bd9a'),
	('9053dd04-a7db-433a-874b-65330056b6fc', '9053dd04-a7db-433a-874b-65330056b6fc', '{"sub": "9053dd04-a7db-433a-874b-65330056b6fc", "name": "Luis Hernández", "email": "luis.hernandez.test@mailinator.com", "phone": "+57 300 567 8901", "email_verified": false, "phone_verified": false}', 'email', '2025-10-20 01:10:03.161581+00', '2025-10-20 01:10:03.161628+00', '2025-10-20 01:10:03.161628+00', '4cda87c8-5fb9-4218-8d8a-69bd4a40be34'),
	('75e62d04-33f2-44aa-a615-f961866f7c05', '75e62d04-33f2-44aa-a615-f961866f7c05', '{"sub": "75e62d04-33f2-44aa-a615-f961866f7c05", "name": "Sofía López", "email": "sofia.lopez.test@mailinator.com", "phone": "+57 300 678 9012", "email_verified": false, "phone_verified": false}', 'email', '2025-10-20 01:10:03.701346+00', '2025-10-20 01:10:03.701396+00', '2025-10-20 01:10:03.701396+00', '12e241d1-5985-4638-821f-1b5ec5ba5f5d'),
	('a87b6ae9-13d0-42e2-9aa3-bd4bd6d4d3b9', 'a87b6ae9-13d0-42e2-9aa3-bd4bd6d4d3b9', '{"sub": "a87b6ae9-13d0-42e2-9aa3-bd4bd6d4d3b9", "name": "Diego González", "email": "diego.gonzalez.test@mailinator.com", "phone": "+57 300 789 0123", "email_verified": false, "phone_verified": false}', 'email', '2025-10-20 01:10:04.224465+00', '2025-10-20 01:10:04.224513+00', '2025-10-20 01:10:04.224513+00', 'ca3580fa-1e9b-464d-ab66-a696e04f402a'),
	('0fb7f2c1-30cf-4ae1-b9b0-918b2024398b', '0fb7f2c1-30cf-4ae1-b9b0-918b2024398b', '{"sub": "0fb7f2c1-30cf-4ae1-b9b0-918b2024398b", "name": "Valentina Ramírez", "email": "valentina.ramirez.test@mailinator.com", "phone": "+57 300 890 1234", "email_verified": false, "phone_verified": false}', 'email', '2025-10-20 01:10:04.755327+00', '2025-10-20 01:10:04.75537+00', '2025-10-20 01:10:04.75537+00', '94c849ca-49e9-4baa-b68d-91e3092797d1'),
	('b8b57664-67f4-472a-ad66-7f48064ba0c0', 'b8b57664-67f4-472a-ad66-7f48064ba0c0', '{"sub": "b8b57664-67f4-472a-ad66-7f48064ba0c0", "name": "Santiago Torres", "email": "santiago.torres.test@mailinator.com", "phone": "+57 300 901 2345", "email_verified": false, "phone_verified": false}', 'email', '2025-10-20 01:10:05.323094+00', '2025-10-20 01:10:05.323137+00', '2025-10-20 01:10:05.323137+00', '4df3d5fd-3f36-47b9-b8c8-84d7107c734e'),
	('98d96f0d-3e3d-4458-930f-78a9978b6556', '98d96f0d-3e3d-4458-930f-78a9978b6556', '{"sub": "98d96f0d-3e3d-4458-930f-78a9978b6556", "name": "Isabella Jiménez", "email": "isabella.jimenez.test@mailinator.com", "phone": "+57 300 012 3456", "email_verified": false, "phone_verified": false}', 'email', '2025-10-20 01:10:05.889357+00', '2025-10-20 01:10:05.889402+00', '2025-10-20 01:10:05.889402+00', 'a350e46c-6c2e-4ce9-9a2a-4305c230abbe');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id") VALUES
	('1cf2b338-f9f7-4061-a024-6820dd5e36b9', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', '2025-10-20 01:49:42.410861+00', '2025-10-20 01:49:42.410861+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '181.134.140.153', NULL, NULL),
	('140ada96-261b-4c54-a7e8-aa2c6f1b6dc7', '75e62d04-33f2-44aa-a615-f961866f7c05', '2025-10-20 02:25:46.166765+00', '2025-10-20 14:20:21.176182+00', NULL, 'aal1', NULL, '2025-10-20 14:20:21.176097', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '190.71.60.226', NULL, NULL),
	('fa9394a1-9a25-481f-99e9-7b344c56fc5a', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', '2025-10-20 01:47:09.004209+00', '2025-10-20 16:00:23.822697+00', NULL, 'aal1', NULL, '2025-10-20 16:00:23.82209', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '190.71.60.226', NULL, NULL),
	('c9dfcba5-c3bd-4810-9b0b-57969c54214b', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', '2025-10-20 16:23:49.282936+00', '2025-10-20 16:23:49.282936+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '190.71.60.226', NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('fa9394a1-9a25-481f-99e9-7b344c56fc5a', '2025-10-20 01:47:09.014584+00', '2025-10-20 01:47:09.014584+00', 'password', 'ae30dead-005d-4479-9763-0116ce5c16d1'),
	('1cf2b338-f9f7-4061-a024-6820dd5e36b9', '2025-10-20 01:49:42.414573+00', '2025-10-20 01:49:42.414573+00', 'password', '91e05415-ade9-4a67-8b23-c9d659aff4e3'),
	('140ada96-261b-4c54-a7e8-aa2c6f1b6dc7', '2025-10-20 02:25:46.169947+00', '2025-10-20 02:25:46.169947+00', 'password', '28045176-390b-4cd4-8032-93dd051b1fd0'),
	('c9dfcba5-c3bd-4810-9b0b-57969c54214b', '2025-10-20 16:23:49.310068+00', '2025-10-20 16:23:49.310068+00', 'password', '64444266-e5a6-4ddc-892a-a7f19e8e5fa8');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") VALUES
	('81003289-29de-4b25-86a9-5009b1724605', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', 'confirmation_token', '5f2b09a512ee2eaea9d60f7221ce152ca63f2d763a9af1030eef9a99', 'juan.perez.test@mailinator.com', '2025-10-20 01:10:00.856931', '2025-10-20 01:10:00.856931'),
	('57b75fc8-18bb-4988-a7f3-1ccc9b424934', 'ff3222b0-76fc-498c-bee8-bf57d0aad2e3', 'confirmation_token', '98b0bd99626b1edab4593636f7e7af5023dbf32d601f5094b36b8aa3', 'maria.garcia.test@mailinator.com', '2025-10-20 01:10:01.522007', '2025-10-20 01:10:01.522007'),
	('c05b7c8c-3d0b-426f-b772-1a03fef1e864', 'c3683f44-c77d-4a9e-9b68-bfbdd494821c', 'confirmation_token', 'bfdc1f87202bfd2b45f2529d981f7d8ca4dac410ddba7ecb27973f58', 'carlos.rodriguez.test@mailinator.com', '2025-10-20 01:10:02.199784', '2025-10-20 01:10:02.199784'),
	('7b049ccc-103f-4cba-9552-aa5a58b0505a', '14a0bf20-93fe-4f0d-a58e-dcfccd280fdf', 'confirmation_token', '03a4c4cb0a50e3263d40977cd140da38e32e54c371a80be3a87b01d0', 'ana.martinez.test@mailinator.com', '2025-10-20 01:10:02.736985', '2025-10-20 01:10:02.736985'),
	('18d232c8-43d3-4ad9-8a45-5ba0de512619', '9053dd04-a7db-433a-874b-65330056b6fc', 'confirmation_token', 'd412218e21217507723bfe39da7985a564028a2bdce9eae893a47e06', 'luis.hernandez.test@mailinator.com', '2025-10-20 01:10:03.267551', '2025-10-20 01:10:03.267551'),
	('ddcfc580-f8b8-45b7-bc39-3e8a5547bacc', '75e62d04-33f2-44aa-a615-f961866f7c05', 'confirmation_token', '258534e723491e5dde06d28618606ac6f4662e07e293e99142a01003', 'sofia.lopez.test@mailinator.com', '2025-10-20 01:10:03.822038', '2025-10-20 01:10:03.822038'),
	('f40e1e72-0234-41dc-9d69-645decf4e917', 'a87b6ae9-13d0-42e2-9aa3-bd4bd6d4d3b9', 'confirmation_token', '66be4cf923430013ae42d052861fa5a25efbee125a1231ed2907c0a2', 'diego.gonzalez.test@mailinator.com', '2025-10-20 01:10:04.32858', '2025-10-20 01:10:04.32858'),
	('4b9dcea4-00a3-43ff-80bd-f73626470ff5', '0fb7f2c1-30cf-4ae1-b9b0-918b2024398b', 'confirmation_token', '6c53e713cadf61b7c8b1f636beb4ed3f3f86775f25faa2d8becb4e4b', 'valentina.ramirez.test@mailinator.com', '2025-10-20 01:10:04.8845', '2025-10-20 01:10:04.8845'),
	('549b6fc7-45c2-4626-9649-ecbcb7bcff7c', 'b8b57664-67f4-472a-ad66-7f48064ba0c0', 'confirmation_token', 'fb2ab4949c16e7b46c7518fbcf223f361cea7eef0598e5c6c06d9519', 'santiago.torres.test@mailinator.com', '2025-10-20 01:10:05.436812', '2025-10-20 01:10:05.436812'),
	('b10a6697-c0fc-44b8-81ef-a596cfa13b39', '98d96f0d-3e3d-4458-930f-78a9978b6556', 'confirmation_token', '040478fbbe1d893986eebc9f94155cf8b64af66661446e568ea4b262', 'isabella.jimenez.test@mailinator.com', '2025-10-20 01:10:06.02329', '2025-10-20 01:10:06.02329');


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 37, 'fgmk2ebmbwpk', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', false, '2025-10-20 01:49:42.412308+00', '2025-10-20 01:49:42.412308+00', NULL, '1cf2b338-f9f7-4061-a024-6820dd5e36b9'),
	('00000000-0000-0000-0000-000000000000', 36, 'ybsx4rbr5laq', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', true, '2025-10-20 01:47:09.008442+00', '2025-10-20 11:09:51.932391+00', NULL, 'fa9394a1-9a25-481f-99e9-7b344c56fc5a'),
	('00000000-0000-0000-0000-000000000000', 47, 'prpv4vfsnsnd', '75e62d04-33f2-44aa-a615-f961866f7c05', true, '2025-10-20 02:25:46.167889+00', '2025-10-20 14:20:21.137272+00', NULL, '140ada96-261b-4c54-a7e8-aa2c6f1b6dc7'),
	('00000000-0000-0000-0000-000000000000', 49, 'v5rev5quxwmq', '75e62d04-33f2-44aa-a615-f961866f7c05', false, '2025-10-20 14:20:21.152268+00', '2025-10-20 14:20:21.152268+00', 'prpv4vfsnsnd', '140ada96-261b-4c54-a7e8-aa2c6f1b6dc7'),
	('00000000-0000-0000-0000-000000000000', 48, 'z5b723ygczhv', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', true, '2025-10-20 11:09:51.955048+00', '2025-10-20 14:31:25.363962+00', 'ybsx4rbr5laq', 'fa9394a1-9a25-481f-99e9-7b344c56fc5a'),
	('00000000-0000-0000-0000-000000000000', 50, 'e6byym5jdrrt', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', true, '2025-10-20 14:31:25.369865+00', '2025-10-20 16:00:23.772624+00', 'z5b723ygczhv', 'fa9394a1-9a25-481f-99e9-7b344c56fc5a'),
	('00000000-0000-0000-0000-000000000000', 51, 'td6pkhhnn3qk', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', false, '2025-10-20 16:00:23.794101+00', '2025-10-20 16:00:23.794101+00', 'e6byym5jdrrt', 'fa9394a1-9a25-481f-99e9-7b344c56fc5a'),
	('00000000-0000-0000-0000-000000000000', 52, 'jixuclnoqc2y', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', false, '2025-10-20 16:23:49.29981+00', '2025-10-20 16:23:49.29981+00', NULL, 'c9dfcba5-c3bd-4810-9b0b-57969c54214b');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: properties; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."properties" ("id", "title", "description", "address", "neighborhood", "city", "coordinates", "bedrooms", "bathrooms", "area", "parking", "floor", "total_floors", "year_built", "property_type", "strata", "price", "minimum_offer_price", "monthly_costs", "accepts_crypto", "financing", "visit_price", "status", "verified", "premium", "images", "virtual_tour", "freedom_tradition", "legal_documents", "owner_id", "agent_id", "tags", "features", "created_at", "updated_at", "published_at") VALUES
	('655baf6b-edca-4614-8651-fe7933f5cb57', 'Apartamento de Lujo en El Poblado', 'Hermoso apartamento de 3 habitaciones en el corazón de El Poblado, con vista panorámica a la ciudad.', 'Carrera 43A # 1-50', 'El Poblado', 'Medellín', '{"lat": 6.2088, "lng": -75.5677}', 3, 2, 120, 1, NULL, NULL, NULL, 'apartment', NULL, 850000000, NULL, 450000, false, false, 49000, 'published', true, true, '{https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop}', NULL, NULL, '{}', 'cf1a5f8b-9b4d-4f69-9161-bd4a48c08982', NULL, '{}', '{"Pisos en mármol","Cocina integral","Balcón privado"}', '2025-10-20 00:32:29.459443+00', '2025-10-20 00:32:29.459443+00', NULL),
	('676a25fe-52fb-47cd-aa2a-18d931e2b180', 'Casa Moderna en Laureles', 'Casa de 4 habitaciones con diseño moderno, jardín privado y zona de parrilla.', 'Calle 70 # 45-23', 'Laureles', 'Medellín', '{"lat": 6.2508, "lng": -75.5906}', 4, 3, 180, 2, NULL, NULL, NULL, 'house', NULL, 650000000, NULL, 320000, false, false, 49000, 'published', true, true, '{https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop}', NULL, NULL, '{}', 'cf1a5f8b-9b4d-4f69-9161-bd4a48c08982', NULL, '{}', '{"Jardín privado","Zona de parrilla","4 habitaciones"}', '2025-10-20 00:32:29.459443+00', '2025-10-20 00:32:29.459443+00', NULL),
	('ea445759-ca68-4463-973e-4f90359e2ce4', 'Penthouse en Envigado', 'Exclusivo penthouse con terraza privada, vista 360° a la ciudad.', 'Carrera 48 # 25-15', 'Envigado', 'Medellín', '{"lat": 6.1699, "lng": -75.5856}', 4, 3, 200, 2, NULL, NULL, NULL, 'apartment', NULL, 1200000000, NULL, 680000, false, false, 49000, 'published', true, true, '{https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop}', NULL, NULL, '{}', 'cf1a5f8b-9b4d-4f69-9161-bd4a48c08982', NULL, '{}', '{"Terraza privada",Jacuzzi,"Vista 360°"}', '2025-10-20 00:32:29.459443+00', '2025-10-20 00:32:29.459443+00', NULL),
	('550e8400-e29b-41d4-a716-446655440011', 'Apartamento Moderno en El Poblado', 'Hermoso apartamento moderno ubicado en el corazón de El Poblado, con excelente conectividad y cerca a centros comerciales, restaurantes y zonas verdes. Ideal para familias jóvenes o profesionales.', 'Carrera 43A #15-25, El Poblado', 'El Poblado', 'Medellín', '{"lat": 6.2088, "lng": -75.5656}', 3, 2, 85, 1, 8, 15, 2020, 'apartment', 6, 450000000, NULL, 1200000, true, true, 49000, 'published', true, true, '{https://example.com/prop1-1.jpg,https://example.com/prop1-2.jpg,https://example.com/prop1-3.jpg}', NULL, NULL, '{}', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', 'ff3222b0-76fc-498c-bee8-bf57d0aad2e3', '{moderno,el-poblado,conectividad}', '{balcón,gimnasio,piscina,parqueadero}', '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440012', 'Casa Familiar en Laureles', 'Casa amplia y cómoda en Laureles, con jardín privado y excelente distribución. Perfecta para familias que buscan tranquilidad sin alejarse del centro de la ciudad.', 'Calle 70 #45-23, Laureles', 'Laureles', 'Medellín', '{"lat": 6.2500, "lng": -75.6000}', 4, 3, 120, 2, 1, 2, 2018, 'house', 0, 380000000, NULL, 800000, false, true, 45000, 'published', true, false, '{https://example.com/prop2-1.jpg,https://example.com/prop2-2.jpg}', NULL, NULL, '{}', 'c3683f44-c77d-4a9e-9b68-bfbdd494821c', '14a0bf20-93fe-4f0d-a58e-dcfccd280fdf', '{familiar,laureles,jardín}', '{jardín,garaje,terraza}', '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440013', 'Penthouse de Lujo en Envigado', 'Exclusivo penthouse con vista panorámica de la ciudad, acabados de lujo y todas las comodidades. Ideal para ejecutivos de alto nivel.', 'Carrera 48 #30-45, Envigado', 'Envigado', 'Medellín', '{"lat": 6.1667, "lng": -75.5833}', 3, 3, 95, 2, 20, 20, 2022, 'apartment', 6, 650000000, NULL, 1800000, true, true, 75000, 'published', true, true, '{https://example.com/prop3-1.jpg,https://example.com/prop3-2.jpg,https://example.com/prop3-3.jpg,https://example.com/prop3-4.jpg}', NULL, NULL, '{}', '9053dd04-a7db-433a-874b-65330056b6fc', '75e62d04-33f2-44aa-a615-f961866f7c05', '{lujo,envigado,penthouse}', '{vista-panorámica,acabados-lujo,concierge,gimnasio}', '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440014', 'Apartamento en Sabaneta', 'Apartamento cómodo y bien ubicado en Sabaneta, cerca a estación del metro y centros comerciales. Excelente opción para inversión o vivienda.', 'Calle 50 #75-12, Sabaneta', 'Sabaneta', 'Medellín', '{"lat": 6.1500, "lng": -75.6167}', 2, 2, 65, 1, 5, 8, 2019, 'apartment', 6, 280000000, NULL, 600000, false, true, 35000, 'published', true, false, '{https://example.com/prop4-1.jpg,https://example.com/prop4-2.jpg}', NULL, NULL, '{}', 'a87b6ae9-13d0-42e2-9aa3-bd4bd6d4d3b9', '0fb7f2c1-30cf-4ae1-b9b0-918b2024398b', '{sabaneta,metro,inversión}', '{balcón,gimnasio}', '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440015', 'Casa en Rionegro', 'Casa campestre en Rionegro, con amplios espacios verdes y tranquilidad. Perfecta para quienes buscan alejarse del ruido de la ciudad.', 'Vereda La Unión, Rionegro', 'Rionegro', 'Rionegro', '{"lat": 6.1500, "lng": -75.3833}', 5, 4, 200, 3, 1, 1, 2017, 'house', 0, 320000000, NULL, 500000, false, true, 40000, 'published', true, false, '{https://example.com/prop5-1.jpg,https://example.com/prop5-2.jpg,https://example.com/prop5-3.jpg}', NULL, NULL, '{}', 'b8b57664-67f4-472a-ad66-7f48064ba0c0', '98d96f0d-3e3d-4458-930f-78a9978b6556', '{campestre,rionegro,tranquilidad}', '{jardín,garaje,terraza,chimenea}', '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00');


--
-- Data for Name: offers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."offers" ("id", "property_id", "buyer_id", "lawyer_id", "offer_price", "original_price", "payment_method", "financing_details", "crypto_details", "closing_date", "conditions", "status", "counter_offer", "metrics", "created_at", "expires_at", "updated_at", "negotiation_progress", "auto_rejected", "rejection_reason", "milestones_completed", "currency", "exchange_rate", "competitiveness_score") VALUES
	('420aeff1-f64e-493e-bca4-d846b668aa9d', '655baf6b-edca-4614-8651-fe7933f5cb57', 'b9f2f689-0a51-4cef-8ca5-749188a0a38f', NULL, 820000000, 850000000, 'cash', NULL, NULL, '2025-11-19', '{}', 'accepted', NULL, NULL, '2025-10-20 00:32:29.615045+00', '2025-11-19 00:32:29.615045+00', '2025-10-20 00:32:29.615045+00', 0, false, NULL, '{}', 'COP', 1.0000, 0),
	('550e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440011', '14a0bf20-93fe-4f0d-a58e-dcfccd280fdf', NULL, 400000000, 450000000, 'financing', '{"bank": "Bancolombia", "termMonths": 240, "downPayment": 129000000, "interestRate": 12.5, "monthlyPayment": 2500000}', NULL, '2024-04-01', '{"Financiación 70%","Entrega en 3 meses"}', 'rejected', NULL, NULL, '2025-10-20 02:23:34.174975+00', '2025-10-27 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00', 20, true, 'Precio mínimo no alcanzado', '{"offer_sent": true}', 'COP', 1.0000, 45),
	('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440013', '75e62d04-33f2-44aa-a615-f961866f7c05', NULL, 620000000, 650000000, 'crypto', NULL, '{"amount": 150000, "currency": "USDT", "exchangeRate": 4133.33}', '2024-03-10', '{"Reserva de $50M","Firma en 15 días"}', 'countered', NULL, NULL, '2025-10-20 02:23:34.174975+00', '2025-10-27 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00', 60, false, NULL, '{"offer_sent": true, "price_agreed": true, "visit_completed": true}', 'COP', 1.0000, 78),
	('550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440011', 'ff3222b0-76fc-498c-bee8-bf57d0aad2e3', NULL, 430000000, 450000000, 'cash', NULL, NULL, '2024-03-15', '{"Incluir gastos notariales"}', 'pending', NULL, NULL, '2025-10-20 02:23:34.174975+00', '2025-10-27 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00', 25, false, NULL, '{"offer_sent": true}', 'COP', 1.0000, 85),
	('550e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440011', 'c3683f44-c77d-4a9e-9b68-bfbdd494821c', NULL, 440000000, 450000000, 'bank_transfer', NULL, NULL, '2024-03-20', '{"Entrega inmediata","Incluir gastos notariales"}', 'pending', NULL, NULL, '2025-10-20 02:23:34.174975+00', '2025-10-27 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00', 30, false, NULL, '{"offer_sent": true, "visit_completed": true}', 'COP', 1.0000, 92),
	('550e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440012', '9053dd04-a7db-433a-874b-65330056b6fc', NULL, 370000000, 380000000, 'cash', NULL, NULL, '2024-03-25', '{"Inspección técnica previa"}', 'accepted', NULL, NULL, '2025-10-20 02:23:34.174975+00', '2025-10-27 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00', 95, false, NULL, '{"offer_sent": true, "price_agreed": true, "offer_accepted": true, "payment_agreed": true, "visit_completed": true, "conditions_agreed": true, "closing_date_agreed": true}', 'COP', 1.0000, 88),
	('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440014', 'a87b6ae9-13d0-42e2-9aa3-bd4bd6d4d3b9', NULL, 275000000, 280000000, 'installments', NULL, NULL, '2024-03-30', '{"Cuotas mensuales","Documentación completa"}', 'pending', NULL, NULL, '2025-10-20 02:23:34.174975+00', '2025-10-27 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00', 20, false, NULL, '{"offer_sent": true}', 'COP', 1.0000, 65),
	('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440015', '0fb7f2c1-30cf-4ae1-b9b0-918b2024398b', NULL, 310000000, 320000000, 'financing', '{"bank": "BBVA", "termMonths": 180, "downPayment": 62000000, "interestRate": 11.8, "monthlyPayment": 1800000}', NULL, '2024-04-15', '{"Financiación 80%","Inspección del terreno"}', 'pending', NULL, NULL, '2025-10-20 02:23:34.174975+00', '2025-10-27 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00', 35, false, NULL, '{"offer_sent": true, "visit_completed": true}', 'COP', 1.0000, 72);


--
-- Data for Name: administrative_transitions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."administrative_transitions" ("id", "property_id", "offer_id", "transition_type", "old_owner_id", "new_owner_id", "status", "required_documents", "submitted_documents", "notes", "completed_at", "created_at") VALUES
	('550e8400-e29b-41d4-a716-446655440062', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440019', 'hoa_change', 'c3683f44-c77d-4a9e-9b68-bfbdd494821c', '9053dd04-a7db-433a-874b-65330056b6fc', 'pending', '{carta_autorizacion,copia_cedula}', '{carta_autorizacion}', 'Cambio de propietario en administración', NULL, '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440063', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440019', 'predial_update', 'c3683f44-c77d-4a9e-9b68-bfbdd494821c', '9053dd04-a7db-433a-874b-65330056b6fc', 'pending', '{escritura,copia_cedula}', '{}', 'Actualización de predial', NULL, '2025-10-20 02:23:34.174975+00');


--
-- Data for Name: advisory_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."advisory_sessions" ("id", "user_id", "property_id", "session_type", "context", "advice_given", "user_feedback", "effectiveness_score", "created_at") VALUES
	('550e8400-e29b-41d4-a716-446655440043', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', '550e8400-e29b-41d4-a716-446655440011', 'property_upload', '{"step": "negotiation_rules", "property_type": "apartment"}', '{"advice": "Configura reglas de negociación flexibles para atraer más compradores", "suggestions": ["Precio mínimo del 90%", "Plazo de 90 días", "Múltiples métodos de pago"]}', '{"rating": 5, "comment": "Muy útil"}', 5, '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440044', 'ff3222b0-76fc-498c-bee8-bf57d0aad2e3', '550e8400-e29b-41d4-a716-446655440011', 'offer_creation', '{"offer_price": 430000000, "property_price": 450000000}', '{"advice": "Tu oferta es competitiva, considera incluir condiciones atractivas", "suggestions": ["Incluir gastos notariales", "Proponer cierre rápido"]}', '{"rating": 4, "comment": "Buen consejo"}', 4, '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440045', 'c3683f44-c77d-4a9e-9b68-bfbdd494821c', '550e8400-e29b-41d4-a716-446655440012', 'negotiation', '{"next_steps": "intent_letter", "offer_status": "accepted"}', '{"advice": "Procede con la carta de intención, incluye todas las condiciones acordadas", "suggestions": ["Incluir cláusulas de incumplimiento", "Establecer plazos claros"]}', '{"rating": 5, "comment": "Perfecto"}', 5, '2025-10-20 02:23:34.174975+00');


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: blocked_dates; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."blog_posts" ("id", "title", "slug", "content", "excerpt", "author_id", "status", "featured_image", "tags", "category", "published_at", "created_at", "updated_at") VALUES
	('6b8a1d1b-36fa-4b9e-b149-4ff156ffaf4e', 'Guía Completa de la Promesa de Compraventa en Colombia', 'guia-promesa-compraventa-colombia', 'La promesa de compraventa es uno de los documentos más importantes en el proceso de compra de una propiedad inmobiliaria en Colombia. Este contrato preliminar establece las condiciones bajo las cuales se realizará la venta definitiva y protege tanto al comprador como al vendedor durante el proceso de negociación.', 'Conoce todo sobre la promesa de compraventa en Colombia: elementos esenciales, aspectos legales, ventajas y recomendaciones prácticas para una transacción segura.', '93bfb621-d4f6-44f0-aae0-345946705d46', 'published', NULL, '{}', 'general', '2025-10-20 00:32:29.847277+00', '2025-10-20 00:32:29.847277+00', '2025-10-20 00:32:29.847277+00'),
	('73cd126d-dd3d-4edf-b246-1101620f9935', 'Todo sobre las Escrituras Públicas en Colombia', 'escrituras-publicas-colombia', 'Las escrituras públicas son el documento definitivo que formaliza la transferencia de propiedad de un inmueble en Colombia. Este instrumento notarial tiene plena validez legal y es obligatorio para el registro de la propiedad.', 'Aprende sobre las escrituras públicas en Colombia: características, proceso de escrituración, documentos requeridos, costos y recomendaciones para una transacción exitosa.', '93bfb621-d4f6-44f0-aae0-345946705d46', 'published', NULL, '{}', 'general', '2025-10-20 00:32:29.847277+00', '2025-10-20 00:32:29.847277+00', '2025-10-20 00:32:29.847277+00');


--
-- Data for Name: cases; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."cases" ("id", "lawyer_id", "buyer_id", "seller_id", "property_id", "status", "created_at", "updated_at") VALUES
	('c6ccaa6c-eb6a-42dd-b298-921cdacdeec2', '93bfb621-d4f6-44f0-aae0-345946705d46', 'b9f2f689-0a51-4cef-8ca5-749188a0a38f', 'cf1a5f8b-9b4d-4f69-9161-bd4a48c08982', '655baf6b-edca-4614-8651-fe7933f5cb57', 'active', '2025-10-20 00:32:29.535561+00', '2025-10-20 00:32:29.535561+00');


--
-- Data for Name: case_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."chat_messages" ("id", "case_id", "sender_id", "receiver_id", "message", "read", "created_at", "message_type", "document_url", "document_name") VALUES
	('607de8b8-7dca-467f-9547-e717c4509ff0', 'c6ccaa6c-eb6a-42dd-b298-921cdacdeec2', '93bfb621-d4f6-44f0-aae0-345946705d46', 'cf1a5f8b-9b4d-4f69-9161-bd4a48c08982', 'Hola Ana, he revisado la documentación del apartamento. Todo está en orden para proceder con la escrituración.', false, '2025-10-20 00:32:30.001337+00', 'text', NULL, NULL),
	('9655aeed-5622-4093-b2f0-afc07827ac98', 'c6ccaa6c-eb6a-42dd-b298-921cdacdeec2', 'cf1a5f8b-9b4d-4f69-9161-bd4a48c08982', '93bfb621-d4f6-44f0-aae0-345946705d46', 'Perfecto, ¿cuándo podemos agendar la firma de la escritura?', false, '2025-10-20 00:32:30.001337+00', 'text', NULL, NULL);


--
-- Data for Name: contracts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."favorites" ("id", "user_id", "property_id", "created_at") VALUES
	('3bb9fb83-817b-4329-870f-4516df98ae92', 'b9f2f689-0a51-4cef-8ca5-749188a0a38f', '655baf6b-edca-4614-8651-fe7933f5cb57', '2025-10-20 00:32:29.772055+00'),
	('c194da8c-a5b1-4515-8a27-81f70ebf5642', 'b9f2f689-0a51-4cef-8ca5-749188a0a38f', '676a25fe-52fb-47cd-aa2a-18d931e2b180', '2025-10-20 00:32:29.772055+00');


--
-- Data for Name: fiscal_simulations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."fiscal_simulations" ("id", "offer_id", "simulation_type", "base_amount", "currency", "notary_fees", "registration_tax", "income_tax", "vat", "other_taxes", "total_taxes", "net_amount", "optimization_suggestions", "created_at") VALUES
	('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440016', 'buyer_taxes', 430000000, 'COP', 2150000, 4300000, 0, 0, 860000, 7310000, 422690000, '{"suggestions": ["Considera financiación para deducir intereses", "Evalúa el beneficio de vivienda VIS"]}', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440017', 'buyer_taxes', 440000000, 'COP', 2200000, 4400000, 0, 0, 880000, 7480000, 432520000, '{"suggestions": ["Aprovecha el crédito hipotecario", "Considera el ahorro en CDT"]}', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440019', 'seller_taxes', 370000000, 'COP', 1850000, 3700000, 37000000, 0, 740000, 42590000, 327410000, '{"suggestions": ["Considera la exención por vivienda principal", "Evalúa la venta a plazo"]}', '2025-10-20 02:23:34.174975+00');


--
-- Data for Name: intent_letters; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."intent_letters" ("id", "offer_id", "property_id", "buyer_id", "seller_id", "content", "status", "buyer_signed_at", "seller_signed_at", "buyer_signature", "seller_signature", "created_at", "updated_at") VALUES
	('550e8400-e29b-41d4-a716-446655440038', '550e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440012', '9053dd04-a7db-433a-874b-65330056b6fc', 'c3683f44-c77d-4a9e-9b68-bfbdd494821c', 'Por medio de la presente, manifiesto mi intención de compra de la propiedad ubicada en Calle 70 #45-23, Laureles, por un valor de $370,000,000 COP, bajo las condiciones acordadas...', 'signed', '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00', NULL, NULL, '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440039', '550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440013', '75e62d04-33f2-44aa-a615-f961866f7c05', '9053dd04-a7db-433a-874b-65330056b6fc', 'Por medio de la presente, manifiesto mi intención de compra de la propiedad ubicada en Carrera 48 #30-45, Envigado, por un valor de $620,000,000 COP, bajo las condiciones acordadas...', 'pending_signatures', '2025-10-20 02:23:34.174975+00', NULL, NULL, NULL, '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00');


--
-- Data for Name: knowledge_base; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."knowledge_base" ("id", "user_id", "property_id", "category", "level", "title", "content", "context", "source", "is_read", "created_at", "updated_at") VALUES
	('550e8400-e29b-41d4-a716-446655440040', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', '550e8400-e29b-41d4-a716-446655440011', 'legal', 'fundamental', 'Requisitos Legales para Venta de Apartamento', 'Para vender un apartamento en Colombia necesitas: 1) Libertad y tradición, 2) Paz y salvo de administración, 3) Certificado de tradición y libertad, 4) Avalúo comercial...', '{"context": "property_sale", "property_type": "apartment"}', 'ai_generated', false, '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440041', 'ff3222b0-76fc-498c-bee8-bf57d0aad2e3', '550e8400-e29b-41d4-a716-446655440011', 'financial', 'best_practices', 'Estrategias de Negociación de Precios', 'Para negociar el precio de una propiedad: 1) Investiga precios similares en la zona, 2) Considera el estado de la propiedad, 3) Evalúa la urgencia del vendedor, 4) Propón condiciones atractivas...', '{"context": "price_negotiation", "property_type": "apartment"}', 'ai_generated', false, '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440042', 'c3683f44-c77d-4a9e-9b68-bfbdd494821c', '550e8400-e29b-41d4-a716-446655440012', 'tax', 'advanced', 'Optimización Fiscal en Compra de Vivienda', 'Para optimizar fiscalmente la compra de vivienda: 1) Aprovecha el beneficio de vivienda VIS, 2) Considera el crédito hipotecario, 3) Evalúa la deducción de intereses, 4) Planifica el pago de impuestos...', '{"context": "tax_optimization", "property_type": "house"}', 'ai_generated', false, '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00');


--
-- Data for Name: legal_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."legal_documents" ("id", "property_id", "offer_id", "document_type", "title", "content", "version", "status", "requires_signatures", "buyer_signed_at", "seller_signed_at", "lawyer_approved_at", "file_url", "created_at", "updated_at") VALUES
	('550e8400-e29b-41d4-a716-446655440059', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440019', 'promesa', 'Promesa de Compraventa - Casa Familiar en Laureles', 'PROMESA DE COMPRAVENTA\n\nEntre los suscritos, [VENDEDOR] y [COMPRADOR], se acuerda la siguiente promesa de compraventa...', 1, 'signed', true, '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00', NULL, '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440020', 'promesa', 'Promesa de Compraventa - Penthouse de Lujo en Envigado', 'PROMESA DE COMPRAVENTA\n\nEntre los suscritos, [VENDEDOR] y [COMPRADOR], se acuerda la siguiente promesa de compraventa...', 1, 'pending_review', true, '2025-10-20 02:23:34.174975+00', NULL, NULL, NULL, '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00');


--
-- Data for Name: login_attempts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: negotiation_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."negotiation_rules" ("id", "property_id", "min_price", "max_closing_days", "required_payment_methods", "auto_reject_enabled", "manual_review_threshold", "special_conditions", "created_at", "updated_at") VALUES
	('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440011', 420000000, 90, '{cash,bank_transfer}', true, true, '{"Incluir gastos notariales","Entrega inmediata"}', '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440012', 350000000, 120, '{cash,financing}', true, false, '{"Inspección técnica previa"}', '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440013', 600000000, 60, '{cash,bank_transfer,crypto}', true, true, '{"Reserva de $50M","Firma en 15 días"}', '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440014', 250000000, 90, '{cash,financing,installments}', false, true, '{"Documentación completa"}', '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440015', 300000000, 150, '{cash,financing}', true, false, '{"Inspección del terreno"}', '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00');


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."notifications" ("id", "user_id", "type", "title", "message", "read", "related_id", "related_type", "created_at", "read_at", "data", "updated_at") VALUES
	('550e8400-e29b-41d4-a716-446655440047', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', 'offer_received', 'Nueva Oferta Recibida', 'Has recibido una nueva oferta de $440,000,000 para Apartamento Moderno en El Poblado', false, NULL, NULL, '2025-10-20 02:23:34.174975+00', NULL, '{"buyer_id": "user-3", "offer_id": "offer-2", "offer_price": 440000000, "property_id": "prop-1", "property_title": "Apartamento Moderno en El Poblado"}', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440048', 'ff3222b0-76fc-498c-bee8-bf57d0aad2e3', 'offer_accepted', 'Oferta Aceptada', 'Tu oferta de $370,000,000 para Casa Familiar en Laureles ha sido aceptada!', false, NULL, NULL, '2025-10-20 02:23:34.174975+00', NULL, '{"status": "accepted", "offer_id": "offer-4", "offer_price": 370000000, "property_id": "prop-2", "property_title": "Casa Familiar en Laureles"}', '2025-10-20 02:23:34.174975+00'),
	('43058034-e366-4b50-ad37-0c1bea80426e', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', 'offer_received', 'Nueva Oferta Recibida', 'Has recibido una nueva oferta de $430000000 para Apartamento Moderno en El Poblado', false, NULL, NULL, '2025-10-20 02:23:34.174975+00', NULL, '{"buyer_id": "ff3222b0-76fc-498c-bee8-bf57d0aad2e3", "offer_id": "550e8400-e29b-41d4-a716-446655440016", "offer_price": 430000000, "property_id": "550e8400-e29b-41d4-a716-446655440011", "property_title": "Apartamento Moderno en El Poblado"}', '2025-10-20 02:23:34.174975+00'),
	('63505099-3e1c-45ac-99cc-11ca0b272aa3', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', 'offer_received', 'Nueva Oferta Recibida', 'Has recibido una nueva oferta de $440000000 para Apartamento Moderno en El Poblado', false, NULL, NULL, '2025-10-20 02:23:34.174975+00', NULL, '{"buyer_id": "c3683f44-c77d-4a9e-9b68-bfbdd494821c", "offer_id": "550e8400-e29b-41d4-a716-446655440017", "offer_price": 440000000, "property_id": "550e8400-e29b-41d4-a716-446655440011", "property_title": "Apartamento Moderno en El Poblado"}', '2025-10-20 02:23:34.174975+00'),
	('cec584b4-b22e-4c7f-a86e-8dd060b77fdd', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', 'offer_received', 'Nueva Oferta Recibida', 'Has recibido una nueva oferta de $400000000 para Apartamento Moderno en El Poblado', false, NULL, NULL, '2025-10-20 02:23:34.174975+00', NULL, '{"buyer_id": "14a0bf20-93fe-4f0d-a58e-dcfccd280fdf", "offer_id": "550e8400-e29b-41d4-a716-446655440018", "offer_price": 400000000, "property_id": "550e8400-e29b-41d4-a716-446655440011", "property_title": "Apartamento Moderno en El Poblado"}', '2025-10-20 02:23:34.174975+00'),
	('1cfb8b25-c16b-4785-b3f0-b22c0be081d5', 'c3683f44-c77d-4a9e-9b68-bfbdd494821c', 'offer_received', 'Nueva Oferta Recibida', 'Has recibido una nueva oferta de $370000000 para Casa Familiar en Laureles', false, NULL, NULL, '2025-10-20 02:23:34.174975+00', NULL, '{"buyer_id": "9053dd04-a7db-433a-874b-65330056b6fc", "offer_id": "550e8400-e29b-41d4-a716-446655440019", "offer_price": 370000000, "property_id": "550e8400-e29b-41d4-a716-446655440012", "property_title": "Casa Familiar en Laureles"}', '2025-10-20 02:23:34.174975+00'),
	('38b5f07c-482f-41ca-ad83-13e5ec36b6be', '9053dd04-a7db-433a-874b-65330056b6fc', 'offer_received', 'Nueva Oferta Recibida', 'Has recibido una nueva oferta de $620000000 para Penthouse de Lujo en Envigado', false, NULL, NULL, '2025-10-20 02:23:34.174975+00', NULL, '{"buyer_id": "75e62d04-33f2-44aa-a615-f961866f7c05", "offer_id": "550e8400-e29b-41d4-a716-446655440020", "offer_price": 620000000, "property_id": "550e8400-e29b-41d4-a716-446655440013", "property_title": "Penthouse de Lujo en Envigado"}', '2025-10-20 02:23:34.174975+00'),
	('cdc6aa19-cd35-4d6e-95a9-532c25709001', 'a87b6ae9-13d0-42e2-9aa3-bd4bd6d4d3b9', 'offer_received', 'Nueva Oferta Recibida', 'Has recibido una nueva oferta de $275000000 para Apartamento en Sabaneta', false, NULL, NULL, '2025-10-20 02:23:34.174975+00', NULL, '{"buyer_id": "a87b6ae9-13d0-42e2-9aa3-bd4bd6d4d3b9", "offer_id": "550e8400-e29b-41d4-a716-446655440021", "offer_price": 275000000, "property_id": "550e8400-e29b-41d4-a716-446655440014", "property_title": "Apartamento en Sabaneta"}', '2025-10-20 02:23:34.174975+00'),
	('5725cdc7-eda5-42c7-85da-0d3c43963262', 'b8b57664-67f4-472a-ad66-7f48064ba0c0', 'offer_received', 'Nueva Oferta Recibida', 'Has recibido una nueva oferta de $310000000 para Casa en Rionegro', false, NULL, NULL, '2025-10-20 02:23:34.174975+00', NULL, '{"buyer_id": "0fb7f2c1-30cf-4ae1-b9b0-918b2024398b", "offer_id": "550e8400-e29b-41d4-a716-446655440022", "offer_price": 310000000, "property_id": "550e8400-e29b-41d4-a716-446655440015", "property_title": "Casa en Rionegro"}', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440046', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', 'offer_received', 'Nueva Oferta Recibida', 'Has recibido una nueva oferta de $430,000,000 para Apartamento Moderno en El Poblado', false, NULL, NULL, '2025-10-20 02:23:34.174975+00', NULL, '{"buyer_id": "user-2", "offer_id": "offer-1", "offer_price": 430000000, "property_id": "prop-1", "property_title": "Apartamento Moderno en El Poblado"}', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440049', '14a0bf20-93fe-4f0d-a58e-dcfccd280fdf', 'offer_rejected', 'Oferta Rechazada', 'Tu oferta de $400,000,000 para Apartamento Moderno en El Poblado ha sido rechazada.', false, NULL, NULL, '2025-10-20 02:23:34.174975+00', NULL, '{"status": "rejected", "offer_id": "offer-3", "offer_price": 400000000, "property_id": "prop-1", "property_title": "Apartamento Moderno en El Poblado"}', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440050', '75e62d04-33f2-44aa-a615-f961866f7c05', 'counter_offer', 'Contraoferta Recibida', 'Has recibido una contraoferta para Penthouse de Lujo en Envigado', false, NULL, NULL, '2025-10-20 02:23:34.174975+00', NULL, '{"status": "countered", "offer_id": "offer-5", "offer_price": 620000000, "property_id": "prop-3", "property_title": "Penthouse de Lujo en Envigado"}', '2025-10-20 02:23:34.174975+00');


--
-- Data for Name: offer_attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: offer_comparisons; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."offer_comparisons" ("id", "property_id", "seller_id", "offer_ids", "comparison_data", "notes", "created_at") VALUES
	('550e8400-e29b-41d4-a716-446655440064', '550e8400-e29b-41d4-a716-446655440011', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', '{550e8400-e29b-41d4-a716-446655440016,550e8400-e29b-41d4-a716-446655440017}', '{"competitiveness": {"550e8400-e29b-41d4-a716-446655440016": 85, "550e8400-e29b-41d4-a716-446655440017": 92}, "payment_methods": {"550e8400-e29b-41d4-a716-446655440016": "cash", "550e8400-e29b-41d4-a716-446655440017": "bank_transfer"}, "price_comparison": {"550e8400-e29b-41d4-a716-446655440016": 430000000, "550e8400-e29b-41d4-a716-446655440017": 440000000}}', 'Comparación entre las dos mejores ofertas', '2025-10-20 02:23:34.174975+00');


--
-- Data for Name: offer_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."offer_history" ("id", "offer_id", "version", "action", "actor_id", "actor_role", "offer_price", "payment_method", "closing_date", "conditions", "changes", "reason", "created_at") VALUES
	('550e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440016', 1, 'created', 'ff3222b0-76fc-498c-bee8-bf57d0aad2e3', 'buyer', 430000000, 'cash', '2024-03-15', '{"Incluir gastos notariales"}', '{"initial_offer": true}', 'Oferta inicial enviada', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440017', 1, 'created', 'c3683f44-c77d-4a9e-9b68-bfbdd494821c', 'buyer', 440000000, 'bank_transfer', '2024-03-20', '{"Entrega inmediata","Incluir gastos notariales"}', '{"initial_offer": true}', 'Oferta inicial enviada', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440018', 1, 'created', '14a0bf20-93fe-4f0d-a58e-dcfccd280fdf', 'buyer', 400000000, 'financing', '2024-04-01', '{"Financiación 70%","Entrega en 3 meses"}', '{"initial_offer": true}', 'Oferta inicial enviada', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440018', 2, 'rejected', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', 'seller', 400000000, 'financing', '2024-04-01', '{"Financiación 70%","Entrega en 3 meses"}', '{"reason": "Precio mínimo no alcanzado", "auto_rejected": true}', 'Precio mínimo no alcanzado', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440019', 1, 'created', '9053dd04-a7db-433a-874b-65330056b6fc', 'buyer', 370000000, 'cash', '2024-03-25', '{"Inspección técnica previa"}', '{"initial_offer": true}', 'Oferta inicial enviada', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440019', 2, 'accepted', 'c3683f44-c77d-4a9e-9b68-bfbdd494821c', 'seller', 370000000, 'cash', '2024-03-25', '{"Inspección técnica previa"}', '{"accepted": true}', 'Oferta aceptada por el vendedor', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440020', 1, 'created', '75e62d04-33f2-44aa-a615-f961866f7c05', 'buyer', 620000000, 'crypto', '2024-03-10', '{"Reserva de $50M","Firma en 15 días"}', '{"initial_offer": true}', 'Oferta inicial enviada', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440020', 2, 'countered', '9053dd04-a7db-433a-874b-65330056b6fc', 'seller', 620000000, 'crypto', '2024-03-10', '{"Reserva de $50M","Firma en 15 días"}', '{"new_price": 640000000, "counter_offer": true}', 'Contraoferta enviada', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440021', 1, 'created', 'a87b6ae9-13d0-42e2-9aa3-bd4bd6d4d3b9', 'buyer', 275000000, 'installments', '2024-03-30', '{"Cuotas mensuales","Documentación completa"}', '{"initial_offer": true}', 'Oferta inicial enviada', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440037', '550e8400-e29b-41d4-a716-446655440022', 1, 'created', '0fb7f2c1-30cf-4ae1-b9b0-918b2024398b', 'buyer', 310000000, 'financing', '2024-04-15', '{"Financiación 80%","Inspección del terreno"}', '{"initial_offer": true}', 'Oferta inicial enviada', '2025-10-20 02:23:34.174975+00');


--
-- Data for Name: payment_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."payment_plans" ("id", "offer_id", "payment_number", "amount", "currency", "exchange_rate", "payment_method", "due_date", "status", "payment_reference", "created_at") VALUES
	('550e8400-e29b-41d4-a716-446655440054', '550e8400-e29b-41d4-a716-446655440021', 1, 55000000, 'COP', 1.0000, 'installments', '2024-04-30', 'pending', NULL, '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440055', '550e8400-e29b-41d4-a716-446655440021', 2, 55000000, 'COP', 1.0000, 'installments', '2024-05-30', 'pending', NULL, '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440056', '550e8400-e29b-41d4-a716-446655440021', 3, 55000000, 'COP', 1.0000, 'installments', '2024-06-30', 'pending', NULL, '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440057', '550e8400-e29b-41d4-a716-446655440021', 4, 55000000, 'COP', 1.0000, 'installments', '2024-07-30', 'pending', NULL, '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440058', '550e8400-e29b-41d4-a716-446655440021', 5, 55000000, 'COP', 1.0000, 'installments', '2024-08-30', 'pending', NULL, '2025-10-20 02:23:34.174975+00');


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "email", "full_name", "avatar_url", "phone", "bio", "location", "website", "role", "status", "preferences", "metadata", "last_login_at", "created_at", "updated_at", "email_verified", "verification_status", "verification_submitted_at", "verification_reviewed_at", "verification_reviewed_by", "verification_rejection_reason", "phone_verified", "address", "date_of_birth", "nationality") VALUES
	('75e62d04-33f2-44aa-a615-f961866f7c05', 'sofia.lopez.test@mailinator.com', 'Sofia López', NULL, NULL, NULL, NULL, NULL, 'user', 'active', '{"theme": "light", "notifications": true}', '{"source": "test", "verified": true}', NULL, '2025-10-20 02:17:43.351171+00', '2025-10-20 13:13:15.021289+00', true, 'unverified', NULL, NULL, NULL, NULL, false, NULL, NULL, NULL),
	('c3683f44-c77d-4a9e-9b68-bfbdd494821c', 'carlos.mendoza.test@mailinator.com', 'Carlos Mendoza', NULL, NULL, NULL, NULL, NULL, 'agent', 'active', '{"theme": "light", "notifications": true}', '{"source": "test", "verified": true}', NULL, '2025-10-20 02:17:43.351171+00', '2025-10-20 13:13:15.021289+00', true, 'unverified', NULL, NULL, NULL, NULL, false, NULL, NULL, NULL),
	('b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', 'maria.rodriguez.test@mailinator.com', 'María Rodríguez', NULL, NULL, NULL, NULL, NULL, 'lawyer', 'active', '{"theme": "light", "notifications": true}', '{"source": "test", "verified": true}', NULL, '2025-10-20 02:17:43.351171+00', '2025-10-20 13:13:15.021289+00', true, 'unverified', NULL, NULL, NULL, NULL, false, NULL, NULL, NULL),
	('ff3222b0-76fc-498c-bee8-bf57d0aad2e3', 'admin.test@mailinator.com', 'Admin User', NULL, NULL, NULL, NULL, NULL, 'admin', 'active', '{"theme": "light", "notifications": true}', '{"source": "test", "verified": true}', NULL, '2025-10-20 02:17:43.351171+00', '2025-10-20 13:13:15.021289+00', true, 'unverified', NULL, NULL, NULL, NULL, false, NULL, NULL, NULL);


--
-- Data for Name: property_availability; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: property_deliveries; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."property_deliveries" ("id", "property_id", "offer_id", "delivery_date", "delivery_time", "delivery_address", "condition_photos", "inventory_items", "buyer_notes", "seller_notes", "delivery_act_url", "status", "created_at", "updated_at") VALUES
	('550e8400-e29b-41d4-a716-446655440061', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440019', '2024-03-25', '14:00:00', 'Calle 70 #45-23, Laureles', '{https://example.com/delivery1-1.jpg,https://example.com/delivery1-2.jpg}', '{"furniture": ["sofa", "dining_table"], "appliances": ["refrigerator", "washing_machine"]}', 'Propiedad en excelente estado', 'Todo en orden', NULL, 'scheduled', '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00');


--
-- Data for Name: public_offers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."public_offers" ("id", "property_id", "seller_id", "offer_type", "starting_price", "current_price", "reserve_price", "auction_end_date", "dutch_auction_decrement", "dutch_auction_interval", "is_active", "total_offers_received", "price_range_visible", "created_at", "updated_at") VALUES
	('550e8400-e29b-41d4-a716-446655440065', '550e8400-e29b-41d4-a716-446655440011', 'b31f8aff-1f3a-4cc4-bc54-234d4fa62c89', 'auction', 400000000, 440000000, 420000000, '2025-10-27 02:23:34.174975+00', 0, 3600, true, 2, true, '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00'),
	('550e8400-e29b-41d4-a716-446655440066', '550e8400-e29b-41d4-a716-446655440013', '9053dd04-a7db-433a-874b-65330056b6fc', 'dutch_auction', 700000000, 650000000, 600000000, '2025-10-23 02:23:34.174975+00', 0, 3600, true, 1, false, '2025-10-20 02:23:34.174975+00', '2025-10-20 02:23:34.174975+00');


--
-- Data for Name: verification_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: visits; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: visit_feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 52, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict z2DTt8PMchKNYXlWpbBO4R6hAEdrqU9ugF3wBM7L1OEeFoRTRHaUMiqGuFoawli

RESET ALL;
